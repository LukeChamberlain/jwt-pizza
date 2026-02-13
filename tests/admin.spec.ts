import { test, expect } from "playwright-test-coverage";
import { Page } from "@playwright/test";

export enum Role {
  Diner = "diner",
  Franchisee = "franchisee",
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
  // ... (Keep your validUsers object here) ...
  const validUsers: Record<string, User> = {
    "a@jwt.com": {
      id: "1",
      name: "Admin User",
      email: "a@jwt.com",
      password: "admin",
      roles: [{ role: Role.Admin }],
    },
  };

  // ... (Keep your mockUsers array here) ...
  const mockUsers: User[] = [
    {
      id: "2",
      name: "Kai Chen",
      email: "d@jwt.com",
      roles: [{ role: Role.Diner }],
    },
    {
      id: "3",
      name: "Fran Chisee",
      email: "f@jwt.com",
      roles: [{ role: Role.Franchisee }],
    },
    {
      id: "4",
      name: "Test User",
      email: "test@jwt.com",
      roles: [{ role: Role.Diner }],
    },
  ];

  // ... (Keep your auth route handling here) ...
  await page.route("*/**/api/auth", async (route) => {
    // ... your existing auth logic ...
    const method = route.request().method();
    if (method === "DELETE") {
      loggedInUser = undefined;
      await route.fulfill({ status: 200 });
      return;
    }
    if (method === "POST" || method === "PUT") {
      const loginReq = route.request().postDataJSON();
      const user = validUsers[loginReq.email];
      if (!user || user.password !== loginReq.password) {
        await route.fulfill({ status: 401, json: { error: "Unauthorized" } });
        return;
      }
      loggedInUser = user;
      await route.fulfill({ json: { user: loggedInUser, token: "abcdef" } });
      return;
    }
    await route.fulfill({ status: 405 });
  });

  // 👇 THIS IS THE CRITICAL FIX 👇
  // Changed from "*/**/api/user?*" to "*/**/api/user*"
  await page.route("**/api/user**", async (route) => {
    const method = route.request().method();
    
    // Handle GET (List users)
    if (method === "GET") {
      const url = new URL(route.request().url());
      const pageNum = parseInt(url.searchParams.get("page") || "0");
      const limit = parseInt(url.searchParams.get("limit") || "10");
      const name = url.searchParams.get("name") || "*";

      let filteredUsers = mockUsers;
      if (name && name !== "*") {
        filteredUsers = mockUsers.filter((u) =>
          u.name.toLowerCase().includes(name.toLowerCase())
        );
      }

      const startIndex = pageNum * limit;
      const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);

      await route.fulfill({
        json: {
          users: paginatedUsers,
          more: startIndex + limit < filteredUsers.length,
        },
      });
      return;
    }

    // Handle DELETE (Delete user)
    if (method === "DELETE") {
      // url ends with /api/user/2
      const userId = route.request().url().split("/").pop();
      const index = mockUsers.findIndex((u) => u.id === userId);
      
      if (index > -1) {
        mockUsers.splice(index, 1);
        await route.fulfill({ status: 200, json: { message: "User deleted" } });
      } else {
        await route.fulfill({ status: 404, json: { message: "User not found" } });
      }
      return;
    }

    await route.fulfill({ status: 405 });
  });
}

test.beforeEach(async ({ page }) => {
  await basicInit(page);
});

test("admin user management", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "Admin" }).click();
  await page.getByRole('button', { name: 'Delete' }).first().click();

  await page.getByRole('cell', { name: 'Fran Chisee' }).click();
  await page.getByRole('cell', { name: 'f@jwt.com' }).click();
  await page.getByText('franchisee', { exact: true }).click();
  await page.getByText('diner').click();
  await page.getByRole('cell', { name: 'test@jwt.com' }).click();
  await page.getByRole('cell', { name: 'Test User' }).click();
  await page.getByRole('link', { name: 'home' }).click();
  await page.getByRole('link', { name: 'Admin' }).click();

});
