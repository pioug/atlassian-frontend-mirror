import { expect } from '@af/integration-testing';
import { test } from './mention';

const EXAMPLE = 'resourced-mention-list';

test.describe('Resourced Mention List User Interactions', () => {
	test('should filter mention items based on search query', async ({ mention }) => {
		await mention.init(EXAMPLE);

		const searchInput = mention.input.first();

		await expect(searchInput).toBeVisible();

		await searchInput.click();

		await searchInput.fill('team');

		const firstItem = mention.mentionListItems.first();

		// Wait for option to be visible
		await expect(firstItem).toBeVisible();

		// Should contain the correct mention items
		await expect(firstItem).toContainText('team', { ignoreCase: true });
	});

	test('should highlight first mention item by default', async ({ mention }) => {
		await mention.init(EXAMPLE);

		const searchInput = mention.input.first();

		await expect(searchInput).toBeVisible();

		await searchInput.click();

		await searchInput.fill('team');

		const firstItem = mention.mentionListItems.first();

		// Wait for option to be visible
		await expect(firstItem).toBeVisible();

		// Should highlight the first mention item by default
		await expect(firstItem).toContainText('team', { ignoreCase: true });
		await expect(firstItem).toHaveAttribute('data-selected', 'true');
	});

	test('should navigate through mentions with keyboard - arrow down', async ({ mention }) => {
		await mention.init(EXAMPLE);

		const searchInput = mention.input.first();

		await expect(searchInput).toBeVisible();

		await searchInput.click();

		const mentionItems = mention.mentionListItems;

		const firstItem = mentionItems.first();

		const itemCount = await mentionItems.count();

		// Ensure there are multiple mention items to navigate
		expect(itemCount).toBeGreaterThan(1);

		// Wait for option to be visible
		await expect(firstItem).toBeVisible();

		// Should highlight the first mention item by default
		await expect(firstItem).toHaveAttribute('data-selected', 'true');

		// Press arrow down
		await mention.page.keyboard.press('ArrowDown');

		// Second item should now be selected
		await expect(firstItem).toHaveAttribute('data-selected', 'false');
		await expect(mentionItems.nth(1)).toHaveAttribute('data-selected', 'true');
	});

	test('should navigate through mentions with keyboard - arrow up', async ({ mention }) => {
		await mention.init(EXAMPLE);

		const searchInput = mention.input.first();

		await expect(searchInput).toBeVisible();

		await searchInput.click();

		const firstItem = mention.mentionListItems.first();

		// Wait for option to be visible
		await expect(firstItem).toBeVisible();

		const mentionItems = mention.mentionListItems;
		const itemCount = await mentionItems.count();

		// Ensure there are multiple mention items to navigate
		expect(itemCount).toBeGreaterThan(1);

		// First item should be selected initially
		await expect(mentionItems.first()).toHaveAttribute('data-selected', 'true');

		// Press arrow up (should wrap to last item)
		await mention.page.keyboard.press('ArrowUp');

		// Last item should now be selected
		await expect(mentionItems.last()).toHaveAttribute('data-selected', 'true');
		await expect(mentionItems.first()).toHaveAttribute('data-selected', 'false');
	});

	test('should update selection on mouse hover', async ({ mention }) => {
		await mention.init(EXAMPLE);

		await mention.input.click();

		const mentionItems = mention.mentionListItems;

		const itemCount = await mentionItems.count();

		// Ensure there are multiple mention items to navigate
		expect(itemCount).toBeGreaterThan(1);

		// First item should be selected initially
		await expect(mentionItems.first()).toHaveAttribute('data-selected', 'true');

		// Hover over second item
		await mentionItems.nth(1).hover();

		// Second item should now be selected
		await expect(mentionItems.nth(1)).toHaveAttribute('data-selected', 'true');
		await expect(mentionItems.first()).toHaveAttribute('data-selected', 'false');
	});

	test('should handle empty results gracefully', async ({ mention }) => {
		await mention.init(EXAMPLE);

		// Type query that returns no results
		await mention.input.fill('definitely-nonexistent-user');

		// Should not show mention items
		const mentionItems = mention.mentionListItems;
		await expect(mentionItems).toHaveCount(0);
	});

	test('should maintain focus on input during navigation', async ({ mention }) => {
		await mention.init(EXAMPLE);

		await mention.input.focus();

		// Navigate through items
		await mention.page.keyboard.press('ArrowDown');
		await mention.page.keyboard.press('ArrowUp');

		// Input should still be focused
		await expect(mention.input).toBeFocused();
	});

	test('should handle search by mention name', async ({ mention }) => {
		await mention.init(EXAMPLE);

		// Type query to search by mention name
		await mention.input.fill('carolyn');

		// Should show mention items
		const mentionItem = mention.mentionListItems.first();
		await expect(mentionItem).toBeVisible();
		await expect(mentionItem).toContainText('carolyn', { ignoreCase: true });
	});
});
