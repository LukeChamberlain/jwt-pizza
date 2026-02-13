import { test, expect } from "playwright-test-coverage";
import { Page } from "@playwright/test";

export enum Role {
  Admin = "admin",
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  roles: { role: Role }[];
}

async function basicInit(page: Page) {
  let loggedInUser: User | undefined;
  const validUsers: Record<string, User> = {
    "a@jwt.com": {
      id: "1",
      name: "Admin User",
      email: "a@jwt.com",
      password: "admin",
      roles: [{ role: Role.Admin }],
    },
  };

  await page.route("*/**/api/auth", async (route) => {
    const method = route.request().method();
    if (method === "DELETE") {
      loggedInUser = undefined;
      await route.fulfill({ status: 200 });
      return;
    }
    if (method === "POST" || method === "PUT") {
      const loginReq = route.request().postDataJSON();
      if (!loginReq) {
        await route.fulfill({
          status: 400,
          json: { error: "Missing credentials" },
        });
        return;
      }
      const user = validUsers[loginReq.email];
      if (!user || user.password !== loginReq.password) {
        await route.fulfill({ status: 401, json: { error: "Unauthorized" } });
        return;
      }
      loggedInUser = user;

      await route.fulfill({
        json: {
          user: loggedInUser,
          token: "abcdef",
        },
      });
      return;
    }
    await route.fulfill({ status: 405 });
  });

  await page.goto("/");

}


test("updateUser", async ({ page }) => {
  const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
  await page.goto("/");
  await page.getByRole("link", { name: "Register" }).click();
  await page.getByRole("textbox", { name: "Full name" }).fill("pizza diner");
  await page.getByRole("textbox", { name: "Email address" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill("diner");
  await page.getByRole("button", { name: "Register" }).click();
  await page.getByRole("link", { name: "pd" }).click();
  await expect(page.getByRole("main")).toContainText("pizza diner");
  await page.getByRole("button", { name: "Edit" }).click();
  await expect(page.locator("h3")).toContainText("Edit user");
  await page.getByRole("textbox").first().fill("pizza dinerx");
  await page.getByRole("button", { name: "Update" }).click();
  await page.waitForSelector('[role="dialog"].hidden', { state: "attached" });
  await expect(page.getByRole("main")).toContainText("pizza diner");
  await page.getByRole("link", { name: "Logout" }).click();
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill("diner");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "pd" }).click();
  await expect(page.getByRole("main")).toContainText("pizza dinerx");
});

test("admin franchise management", async ({ page }) => {
  await basicInit(page);
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "Admin" }).click();
});
