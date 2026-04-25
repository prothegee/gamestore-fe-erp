import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
    test("should login with demo credentials", async ({ page }) => {
        // 1. Visit login page
        await page.goto("/login");
        await expect(page.locator(".login-card__title")).toContainText("GameStore ERP");

        // 2. Fill login form
        await page.fill('input[placeholder="Enter username"]', "demouser");
        await page.fill('input[placeholder="Enter password"]', "demouser");

        // 3. Submit form
        await page.click('button[type="submit"]');

        // 4. Should be redirected to dashboard
        await expect(page).toHaveURL("/");
        await expect(page.locator("h1")).toContainText("Dashboard");
    });

    test("should show error with invalid credentials", async ({ page }) => {
        await page.goto("/login");
        await page.fill('input[placeholder="Enter username"]', "wrong");
        await page.fill('input[placeholder="Enter password"]', "wrong");
        await page.click('button[type="submit"]');

        // Check for error message
        await expect(page.locator(".login-form")).toContainText("Invalid username or password.");
    });
});
