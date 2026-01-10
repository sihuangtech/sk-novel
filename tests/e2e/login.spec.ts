import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  const username = `loginuser_${Date.now()}`;
  const email = `loginuser_${Date.now()}@example.com`;
  const password = 'Password123!';

  test.beforeAll(async ({ request }) => {
    // Pre-register a user via API to ensure we can log in
    const response = await request.post('/api/auth/register', {
      data: {
        username,
        email,
        password,
      },
    });
    expect(response.ok()).toBeTruthy();
  });

  test('should allow a user to login', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // Expect successful login and redirect to home
    await expect(page).toHaveURL('/');
    
    // Check for welcome toast or some element that indicates logged in state
    // The login page shows "Welcome back!" toast
    await expect(page.getByText('Welcome back!')).toBeVisible();
  });
});
