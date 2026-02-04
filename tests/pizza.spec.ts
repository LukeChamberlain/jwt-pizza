import { Page } from "@playwright/test";
import { test, expect } from "playwright-test-coverage";

export enum Role {
  Diner = "diner",
  Admin = "admin",
  Franchisee = "franchisee",
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  roles: { role: Role }[];
  franchiseId?: number;
  franchise?: { id: number; name: string };
  franchises?: { id: number; name: string }[];
}

async function basicInit(page: Page) {
  let loggedInUser: User | undefined;
  const validUsers: Record<string, User> = {
    "d@jwt.com": {
      id: "3",
      name: "Kai Chen",
      email: "d@jwt.com",
      password: "a",
      roles: [{ role: Role.Diner }],
    },
    "f@jwt.com": {
      id: "4",
      name: "Fran Chisee",
      email: "f@jwt.com",
      password: "franchisee",
      roles: [{ role: Role.Franchisee }],
      franchiseId: 2,
      franchises: [{ id: 2, name: "Your pizza kitchen" }],
    },

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
  await page.route("*/**/api/user/me", async (route) => {
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: loggedInUser });
  });
  await page.route("*/**/api/order/menu", async (route) => {
    const menuRes = [
      {
        id: 1,
        title: "Veggie",
        image: "pizza1.png",
        price: 0.0038,
        description: "A garden of delight",
      },
      {
        id: 2,
        title: "Pepperoni",
        image: "pizza2.png",
        price: 0.0042,
        description: "Spicy treat",
      },
    ];
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: menuRes });
  });

  await page.route(/\/api\/franchise(\?.*)?$/, async (route) => {
    const method = route.request().method();
    if (method === "GET") {
      if (loggedInUser?.roles.some((r) => r.role === Role.Franchisee)) {
        await route.fulfill({
          json: {
            franchises: [
              {
                id: loggedInUser.franchiseId ?? 2,
                name: "Your pizza kitchen",
                stores: [
                  { id: 4, name: "Lehi" },
                  { id: 5, name: "Springville" },
                ],
              },
            ],
          },
        });
        return;
      }
      await route.fulfill({
        json: {
          franchises: [
            {
              id: 2,
              name: "LotaPizza",
              stores: [
                { id: 4, name: "Lehi" },
                { id: 5, name: "Springville" },
                { id: 6, name: "American Fork" },
              ],
            },
            {
              id: 3,
              name: "PizzaCorp",
              stores: [{ id: 7, name: "Spanish Fork" }],
            },
            { id: 4, name: "topSpot", stores: [] },
          ],
        },
      });
      return;
    }
    if (method === "POST") {
      const postData = route.request().postDataJSON();
      const created = { id: 99, ...postData };
      await route.fulfill({ json: created });
      return;
    }

    await route.fulfill({
      status: 405,
      json: { error: "Method not allowed" },
    });
  });

  await page.route("*/**/api/auth/register", async (route) => {
    const method = route.request().method();

    if (method !== "POST") {
      await route.fulfill({ status: 405 });
      return;
    }

    const registerReq = route.request().postDataJSON();

    const newUser: User = {
      id: "99",
      name: registerReq.name,
      email: registerReq.email,
      roles: [{ role: Role.Diner }],
    };

    loggedInUser = newUser;

    await route.fulfill({
      json: {
        user: newUser,
        token: "abcdef",
      },
    });
  });

  await page.route(/\/api\/franchise\/\d+\/store$/, async (route) => {
    const postData = route.request().postDataJSON();
    const createdStore = { id: 99, ...postData };
    await route.fulfill({ json: createdStore });
  });

  await page.route(/\/api\/franchise\/\w+$/, async (route) => {
    if (loggedInUser?.roles.some((r) => r.role === Role.Franchisee)) {
      await route.fulfill({
        json: [
          {
            id: 2,
            name: "Your pizza kitchen",
            stores: [
              { id: 4, name: "Lehi", totalRevenue: 120 },
              { id: 5, name: "Springville", totalRevenue: 80 },
            ],
          },
        ],
      });
      return;
    }

    await route.fulfill({ json: [] });
  });

  await page.route("*/**/api/order", async (route) => {
    const method = route.request().method();

    if (method === "POST") {
      const orderReq = route.request().postDataJSON();
      await route.fulfill({
        json: {
          order: { ...orderReq, id: 23 },
          jwt: "eyJpYXQ",
        },
      });
    } else if (method === "GET") {
      await route.fulfill({ json: [] });
    } else {
      await route.fulfill({ status: 405 });
    }
  });

  await page.goto("/");
}

test("login", async ({ page }) => {
  await basicInit(page);
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("d@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("a");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByRole("link", { name: "KC" })).toBeVisible();

  await page.getByRole("link", { name: "About" }).click();
  await page.getByRole("link", { name: "History" }).click();
});

test("register", async ({ page }) => {
  await basicInit(page);
  await page.getByRole("link", { name: "Register" }).click();
  await page.getByRole("textbox", { name: "Full name" }).fill("luke");
  await page.getByRole("textbox", { name: "Email address" }).click();
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("luke@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("test");
  await page.getByRole("button", { name: "Register" }).click();
});

test("purchase with login", async ({ page }) => {
  await basicInit(page);
  await page.getByRole("button", { name: "Order now" }).click();
  await expect(page.locator("h2")).toContainText("Awesome is a click away");
  await page.getByRole("combobox").selectOption("4");
  await page.getByRole("link", { name: "Image Description Veggie A" }).click();
  const pepperoni = page.getByRole("link", {
    name: "Image Description Pepperoni",
  });
  await expect(pepperoni).toBeVisible();
  await pepperoni.click();
  await expect(page.locator("form")).toContainText("Selected pizzas: 2");
  await page.getByRole("button", { name: "Checkout" }).click();
  await page.getByPlaceholder("Email address").click();
  await page.getByPlaceholder("Email address").fill("d@jwt.com");
  await page.getByPlaceholder("Email address").press("Tab");
  await page.getByPlaceholder("Password").fill("a");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("main")).toContainText(
    "Send me those 2 pizzas right now!"
  );
  await expect(page.locator("tbody")).toContainText("Veggie");
  await expect(page.locator("tbody")).toContainText("Pepperoni");
  await expect(page.locator("tfoot")).toContainText("0.008 ₿");
  await page.getByRole("button", { name: "Pay now" }).click();
  await expect(page.getByText("0.008")).toBeVisible();
  await page.getByText("VerifyOrder moreorder ID:").click();
  await page.getByRole("link", { name: "KC" }).click();
});

test("franchisee store management", async ({ page }) => {
  await basicInit(page);
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("f@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("franchisee");
  await page.getByRole("button", { name: "Login" }).click();

  const user = await page.evaluate(async () => {
    const res = await fetch("/api/user/me");
    return res.json();
  });
  console.log("Logged in user:", user);
  await page
    .getByLabel("Global")
    .getByRole("link", { name: "Franchise" })
    .click();
  await page.getByRole("button", { name: "Create store" }).click();
  await page.getByRole("textbox", { name: "store name" }).fill("Orem");
  await Promise.all([
    page.waitForResponse(/\/api\/franchise\/\d+\/store/),
    page.getByRole("button", { name: "Create" }).click(),
  ]);
  await expect(page.getByText("Lehi")).toBeVisible();
  await page
    .getByRole("row", { name: "Lehi 120 ₿ Close" })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "Close" }).click();
});

test("admin franchise management", async ({ page }) => {
  await basicInit(page);
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "Admin" }).click();
  await page.getByRole("button", { name: "Add Franchise" }).click();
  await page
    .getByRole("textbox", { name: "franchise name" })
    .fill("New Empire");
  await page
    .getByRole("textbox", { name: "franchisee admin email" })
    .fill("a@jwt.com");
  await page.getByRole("button", { name: "Create" }).click();
});
