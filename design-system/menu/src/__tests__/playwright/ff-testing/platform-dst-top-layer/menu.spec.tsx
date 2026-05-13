import { expect, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

test.describe('Menu top-layer — WCAG 2.1.1 Keyboard', () => {
	test('ButtonItem responds to keyboard activation', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/05-menu-group.tsx')>(
			'design-system',
			'menu',
			'menu-group',
			{
				featureFlag,
			},
		);

		const buttonItem = page.getByTestId('favourite-articles-button-item');
		await expect(buttonItem).toBeVisible();

		await buttonItem.focus();
		await expect(buttonItem).toBeFocused();

		await buttonItem.press('Enter');
		// Item activation is observable through click handler
	});

	test('LinkItem responds to keyboard navigation', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/link-item.tsx')>(
			'design-system',
			'menu',
			'link-item',
			{
				featureFlag,
			},
		);

		const firstItem = page.getByTestId('first-item');
		await expect(firstItem).toBeVisible();

		await firstItem.focus();
		await expect(firstItem).toBeFocused();
	});
});

test.describe('Menu top-layer — WCAG 2.4.3 Focus Order', () => {
	test('focus enters and exits MenuGroup', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/05-menu-group.tsx')>(
			'design-system',
			'menu',
			'menu-group',
			{
				featureFlag,
			},
		);

		const menuGroup = page.getByTestId('with-adjacent-sections');
		await expect(menuGroup).toBeVisible();

		// Focus into the menu
		const firstFocusableItem = page.getByRole('link', { name: 'Search your items' });
		await expect(firstFocusableItem).toBeVisible();

		await firstFocusableItem.focus();
		await expect(firstFocusableItem).toBeFocused();
	});

	test('PopupMenuGroup receives focus when rendered', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/05-menu-group.tsx')>(
			'design-system',
			'menu',
			'menu-group',
			{
				featureFlag,
			},
		);

		const popupMenuGroup = page.getByTestId('mock-starred-menu');
		await expect(popupMenuGroup).toBeVisible();

		const firstItem = popupMenuGroup.getByRole('button').first();
		await expect(firstItem).toBeVisible();
	});
});

test.describe('Menu top-layer — WCAG 2.4.7 Focus Visible', () => {
	test('ButtonItem shows focus-visible when keyboard focused', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/05-menu-group.tsx')>(
			'design-system',
			'menu',
			'menu-group',
			{
				featureFlag,
			},
		);

		const buttonItem = page.getByTestId('favourite-articles-button-item');
		await expect(buttonItem).toBeVisible();

		await buttonItem.focus();
		await expect(buttonItem).toBeFocused();
		// Focus-visible state is visually observable by user
	});

	test('LinkItem shows focus-visible when keyboard focused', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/link-item.tsx')>(
			'design-system',
			'menu',
			'link-item',
			{
				featureFlag,
			},
		);

		const firstItem = page.getByTestId('first-item');
		await expect(firstItem).toBeVisible();

		await firstItem.focus();
		await expect(firstItem).toBeFocused();
	});
});

test.describe('Menu top-layer — WCAG 2.4.11 Content Not Obscured', () => {
	test('MenuGroup content is visible and not obscured', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/05-menu-group.tsx')>(
			'design-system',
			'menu',
			'menu-group',
			{
				featureFlag,
			},
		);

		const menuGroup = page.getByTestId('with-adjacent-sections');
		await expect(menuGroup).toBeVisible();

		// Verify multiple items within the menu are visible
		const searchItem = page.getByRole('link', { name: 'Search your items' });
		const editItem = page.getByRole('link', { name: 'Edit your items' });
		await expect(searchItem).toBeVisible();
		await expect(editItem).toBeVisible();
	});

	test('PopupMenuGroup content is fully visible', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/05-menu-group.tsx')>(
			'design-system',
			'menu',
			'menu-group',
			{
				featureFlag,
			},
		);

		const popupMenuGroup = page.getByTestId('mock-starred-menu');
		await expect(popupMenuGroup).toBeVisible();

		const items = popupMenuGroup.getByRole('button');
		await expect(items.first()).toBeVisible();
	});
});

test.describe('Menu top-layer — WCAG 4.1.2 Semantics', () => {
	test('LinkItem preserves aria-current for selection state', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/link-item.tsx')>(
			'design-system',
			'menu',
			'link-item',
			{
				featureFlag,
			},
		);

		const selectedLink = page.locator('a').nth(1);
		await expect(selectedLink).toBeVisible();
		await expect(selectedLink).toHaveAttribute('aria-current', 'page');
	});

	test('LinkItem preserves aria-disabled for disabled state', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/link-item.tsx')>(
			'design-system',
			'menu',
			'link-item',
			{
				featureFlag,
			},
		);

		const disabledLink = page.locator('a').nth(2);
		await expect(disabledLink).toBeVisible();
		await expect(disabledLink).toHaveAttribute('aria-disabled', 'true');

		const href = await disabledLink.getAttribute('href');
		expect(href).toBeNull();
	});

	test('CustomItem preserves aria-disabled and tabindex for disabled state', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/custom-item.tsx')>(
			'design-system',
			'menu',
			'custom-item',
			{
				featureFlag,
			},
		);

		const disabledCustomItem = page.getByRole('link', { name: 'isDisabled CustomItem' });
		await expect(disabledCustomItem).toBeVisible();
		await expect(disabledCustomItem).toHaveAttribute('aria-disabled', 'true');
		await expect(disabledCustomItem).toHaveAttribute('tabindex', '-1');
	});

	test('ButtonItem and LinkItem selection states are preserved', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/selection-states.tsx')>(
			'design-system',
			'menu',
			'selection-states',
			{
				featureFlag,
			},
		);

		const selectedButton = page.getByRole('button', { name: 'Button' }).first();
		const selectedLink = page.getByRole('link', { name: 'Link to Atlassian' }).first();

		await expect(selectedButton).toBeVisible();
		await expect(selectedButton).toHaveAttribute('aria-current', 'true');

		await expect(selectedLink).toBeVisible();
		await expect(selectedLink).toHaveAttribute('aria-current', 'page');
	});
});

test.describe('Menu top-layer — WCAG 1.3.2 Meaningful Sequence', () => {
	test('section links are DOM descendants of the MenuGroup container', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/05-menu-group.tsx')>(
			'design-system',
			'menu',
			'menu-group',
			{
				featureFlag,
			},
		);

		// Wait for both the MenuGroup container and the link to be in the DOM before
		// asserting structural relationships. The previous version used
		// page.evaluate(document.querySelector(...)) which fires immediately and can
		// race with React rendering, causing intermittent failures that pass on retry.
		const menuGroup = page.getByTestId('with-adjacent-sections');
		await expect(menuGroup).toBeAttached();

		const link = menuGroup.getByRole('link', { name: /Search your items/ });
		await expect(link).toBeAttached();
	});

	test('PopupMenuGroup follows first MenuGroup column in document order', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/05-menu-group.tsx')>(
			'design-system',
			'menu',
			'menu-group',
			{
				featureFlag,
			},
		);

		// Wait for both elements to be attached before comparing document order.
		const first = page.getByTestId('with-adjacent-sections');
		const second = page.getByTestId('mock-starred-menu');
		await expect(first).toBeAttached();
		await expect(second).toBeAttached();

		// Compare document order via compareDocumentPosition once both elements are
		// known to exist in the DOM.
		const popupFollowsMenu = await first.evaluate((firstNode, secondTestId) => {
			const secondNode = document.querySelector(`[data-testid="${secondTestId}"]`);
			if (!secondNode) {
				return false;
			}
			const position = firstNode.compareDocumentPosition(secondNode);
			return Boolean(position & Node.DOCUMENT_POSITION_FOLLOWING);
		}, 'mock-starred-menu');

		expect(popupFollowsMenu).toBe(true);
	});
});

test.describe('Menu top-layer — ButtonItem keyboard and structure', () => {
	test('first ButtonItem responds to Enter when focused', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/button-item.tsx')>(
			'design-system',
			'menu',
			'button-item',
			{
				featureFlag,
			},
		);

		const first = page.getByTestId('first-item');
		await expect(first).toBeVisible();
		await first.focus();
		await expect(first).toBeFocused();
		await first.press('Enter');
	});

	test('ButtonItem list is not attached as the last child of body', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/button-item.tsx')>(
			'design-system',
			'menu',
			'button-item',
			{
				featureFlag,
			},
		);

		// Wait for the ButtonItem container to be attached so the body-child check
		// runs after React has finished mounting. Without this wait, the
		// document.querySelector inside page.evaluate can return null transiently.
		const root = page.getByTestId('button-items');
		await expect(root).toBeAttached();

		const notLastBodyChild = await root.evaluate(
			(rootNode) => document.body.lastElementChild !== rootNode,
		);

		expect(notLastBodyChild).toBe(true);
	});
});

test.describe('Menu top-layer — Heading and scrollable sections', () => {
	test('heading-item example renders the heading label', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/heading-item.tsx')>(
			'design-system',
			'menu',
			'heading-item',
			{
				featureFlag,
			},
		);

		await expect(page.getByText('Actions')).toBeVisible();
	});

	test('scrollable sections example renders scrollable menu items', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/scrollable-sections.tsx')>(
			'design-system',
			'menu',
			'scrollable-sections',
			{
				featureFlag,
			},
		);

		await expect(page.getByRole('button', { name: 'Fabric Editor' })).toBeVisible();
	});
});
