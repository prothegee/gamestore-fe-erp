import { test, expect } from "@playwright/test";

test.describe("Products Management", () => {
    test.beforeEach(async ({ page }) => {
        // Login before each test to ensure it's self-contained
        await page.goto("/login");
        await page.fill('input[placeholder="Enter username"]', "demouser");
        await page.fill('input[placeholder="Enter password"]', "demouser");
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL("/");
    });

    test("should navigate to products and see initial data", async ({ page }) => {
        await page.goto("/products");
        await expect(page.locator("h1")).toContainText("Products & Inventory");

        // Verify at least one product name is visible
        await expect(page.locator(".product-name").first()).toBeVisible();
    });

    test("should add a new product", async ({ page }) => {
        await page.goto("/products");
        await page.click('button:has-text("Add Product")');

        // Fill form using placeholders since labels aren't connected to inputs with 'for' attribute
        await page.fill('input[placeholder="e.g. Elden Ring"]', "Test Game");
        await page.fill('input[placeholder="e.g. ER-PS5-001"]', "TEST-SKU-001");

        // Find inputs by looking for the sibling label or just by order/placeholder if unique
        // For price and stock, we can use the form-grid and order or specific properties
        await page.locator('input[type="number"]').nth(0).fill("59.99"); // Retail Price
        await page.locator('input[type="number"]').nth(2).fill("100"); // Stock

        // Use a more specific selector for the submit button in the form
        await page.locator(".form-actions button.btn--primary").click();

        // Should see success toast - wait for it to appear
        const toast = page.locator(".toast");
        await expect(toast).toBeVisible();
        await expect(toast).toContainText('"Test Game" added to catalog.');

        // Search for it to confirm it's in the list
        await page.fill('input[placeholder="Search by name or SKU…"]', "Test Game");
        await expect(page.locator(".product-name").first()).toContainText("Test Game");
    });

    test("should search for a product", async ({ page }) => {
        await page.goto("/products");

        const searchInput = page.locator('input[placeholder="Search by name or SKU…"]');
        await searchInput.fill("Elden");

        // Wait for filter to reflect in the results
        const results = page.locator(".product-name");
        await expect(results).toHaveCount(1);
        await expect(results).toContainText("Elden Ring");
    });
});
