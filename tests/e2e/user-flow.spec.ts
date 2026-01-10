import { test, expect } from '@playwright/test';

test.describe('User Flow: Registration, Upgrade, and Recharge', () => {
  const username = `testuser_${Date.now()}`;
  const email = `testuser_${Date.now()}@example.com`;
  const password = 'Password123!';

  test('should allow a user to register, upgrade membership, and recharge coins', async ({ page }) => {
    // 1. Registration
    await page.goto('/register');
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // Expect successful registration and redirect to home
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Account created successfully!')).toBeVisible();

    // 2. Upgrade Membership
    await page.goto('/pricing');
    
    // Find the button for MEMBER tier upgrade
    const upgradeButton = page.getByRole('button', { name: 'Upgrade to MEMBER' });
    await upgradeButton.click();

    // Expect success toast
    await expect(page.getByText('Successfully upgraded to MEMBER!')).toBeVisible();
    
    // Verify button text changes to "Current Plan"
    await expect(page.getByRole('button', { name: 'Current Plan' })).toBeVisible();

    // 3. Recharge Coins
    await page.goto('/recharge');
    
    // Check initial balance (should be 0)
    await expect(page.getByText('0 Coins Balance')).toBeVisible();

    // Buy 100 coins package
    // The button might be "Buy Now" inside the first package card.
    // We can scope it or just click the first "Buy Now" button.
    const buyButton = page.getByRole('button', { name: 'Buy Now' }).first();
    await buyButton.click();

    // Expect success toast
    await expect(page.getByText('Successfully purchased 100 coins!')).toBeVisible();

    // Verify balance update
    await expect(page.getByText('100 Coins Balance')).toBeVisible();
  });
});
