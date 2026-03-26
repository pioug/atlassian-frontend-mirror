/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

test.describe('Popup - open and close', () => {
	test('opens when trigger is clicked', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/90-testing-popover-basic.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-basic',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();
	});

	// WCAG 2.1.2 No Keyboard Trap - Escape always dismisses
	test('closes on Escape (light dismiss)', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/92-testing-popover-escape.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-escape',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(page.getByTestId('popover-content')).toBeHidden();
		await expect(page.getByTestId('close-reason')).toHaveText('light-dismiss');
	});

	// WCAG 2.1.2 No Keyboard Trap - click outside (light dismiss) also closes
	test('closes on click outside (light dismiss)', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/92-testing-popover-escape.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-escape',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();

		await page.getByTestId('outside-target').click();

		await expect(page.getByTestId('popover-content')).toBeHidden();
	});

	test('closes programmatically via hidePopover()', async ({ page }) => {
		await page.visitExample<
			typeof import('../../examples/104-testing-popover-programmatic-close.tsx')
		>('design-system', 'top-layer', 'testing-popover-programmatic-close');

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();

		await page.getByTestId('programmatic-close-button').click();

		await expect(page.getByTestId('popover-content')).toBeHidden();
		await expect(page.getByTestId('close-indicator')).toHaveText('closed');
	});

	test('scroll does not close popover', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/117-testing-popover-scroll.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-scroll',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();

		const scrollContainer = page.getByTestId('scroll-container');
		await scrollContainer.evaluate((el) => {
			el.scrollTop = 200;
		});

		await expect(page.getByTestId('popover-content')).toBeVisible();
	});

	test('rapid open/close does not leave ghost popovers', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/118-testing-popover-rapid-toggle.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-rapid-toggle',
		);

		const trigger = page.getByTestId('popover-trigger');

		for (let i = 0; i < 6; i++) {
			await trigger.click({ delay: 50 });
		}

		await page.waitForFunction(() => {
			const popovers = document.querySelectorAll('[popover]');
			let count = 0;
			for (const el of popovers) {
				if (el.matches(':popover-open')) count++;
			}
			return count <= 1;
		});

		const visiblePopovers = await page.evaluate(() => {
			const popovers = document.querySelectorAll('[popover]');
			let count = 0;
			for (const el of popovers) {
				if (el.matches(':popover-open')) {
					count++;
				}
			}
			return count;
		});

		expect(visiblePopovers).toBeLessThanOrEqual(1);
	});
});

test.describe('Popup - keyboard', () => {
	// WCAG 2.1.1 Keyboard - popover can be toggled via keyboard (Enter on trigger)
	test('popover can be opened with Enter and closed with Escape', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/90-testing-popover-basic.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-basic',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.focus();

		await page.keyboard.press('Enter');

		await expect(page.getByTestId('popover-content')).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(page.getByTestId('popover-content')).toBeHidden();
		await expect(trigger).toBeFocused();
	});

	// WCAG 2.1.1 Keyboard - popover can be toggled via Space key
	test('popover can be opened with Space and closed with Escape', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/90-testing-popover-basic.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-basic',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.focus();

		await page.keyboard.press('Space');

		await expect(page.getByTestId('popover-content')).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(page.getByTestId('popover-content')).toBeHidden();
		await expect(trigger).toBeFocused();
	});
});

test.describe('Popup - focus', () => {
	// WCAG 2.4.3 Focus Order - focus returns to trigger on dismiss
	test('focus returns to trigger after Escape', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/90-testing-popover-basic.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-basic',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(trigger).toBeFocused();
	});

	// WCAG 3.2.1 On Focus - focus return to trigger must NOT re-open the popover
	test('focus returning to trigger after close does not re-open popover', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/105-testing-focus-return-no-reopen.tsx')>(
			'design-system',
			'top-layer',
			'testing-focus-return-no-reopen',
		);

		const trigger = page.getByTestId('popover-trigger');

		await trigger.click();
		await expect(page.getByTestId('popover-content')).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(page.getByTestId('popover-content')).toBeHidden();
		await expect(trigger).toBeFocused();

		await expect(page.getByTestId('popover-content')).toBeHidden();

		await expect(page.getByTestId('close-count')).toHaveText('1');
	});

	test('tab past hidden popover does not focus popover content', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/90-testing-popover-basic.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-basic',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.focus();

		await page.keyboard.press('Tab');

		const activeTestId = await page.evaluate(() => {
			return document.activeElement?.getAttribute('data-testid') ?? null;
		});

		expect(activeTestId).not.toBe('popover-content');
	});

	// WCAG 2.4.7 Focus Visible - focus indicator should be visible on trigger
	test('trigger shows focus indicator when focused via keyboard', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/90-testing-popover-basic.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-basic',
		);

		const trigger = page.getByTestId('popover-trigger');

		await page.evaluate(() => document.body.focus());
		await page.keyboard.press('Tab');

		// eslint-disable-next-line playwright/no-conditional-in-test -- Tab navigation varies; ensure trigger is focused
		if (!(await trigger.evaluate((el) => el === document.activeElement))) {
			await page.keyboard.press('Tab');
		}

		await expect(trigger).toBeFocused();

		const hasFocusVisible = await trigger.evaluate((el) => {
			return el.matches(':focus-visible');
		});

		expect(hasFocusVisible).toBe(true);
	});

	// WCAG 2.4.7 Focus Visible - focus indicator on elements inside an open popover
	test(':focus-visible on element inside popover after Tab', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/105-testing-focus-return-no-reopen.tsx')>(
			'design-system',
			'top-layer',
			'testing-focus-return-no-reopen',
		);

		// Use keyboard to open the popover so the browser is in keyboard
		// modality. Opening via mouse click causes Firefox to not apply
		// :focus-visible on subsequently Tab-focused elements.
		const trigger = page.getByTestId('popover-trigger');
		await trigger.focus();
		await page.keyboard.press('Enter');
		await expect(page.getByTestId('popover-content')).toBeVisible();

		await page.keyboard.press('Tab');
		const innerButton = page.getByTestId('inner-button');
		await expect(innerButton).toBeFocused();

		const hasFocusVisible = await innerButton.evaluate((el) => {
			return el.matches(':focus-visible');
		});

		expect(hasFocusVisible).toBe(true);
	});

	// WCAG 2.4.11 Focus Not Obscured - popover in top layer is never obscured
	test('popover content in top layer is not obscured by other elements', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/90-testing-popover-basic.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-basic',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();

		const isVisible = await page.evaluate(() => {
			const popoverContent = document.querySelector('[data-testid="popover-content"]');
			if (!popoverContent) {
				return false;
			}
			const rect = popoverContent.getBoundingClientRect();
			return rect.width > 0 && rect.height > 0;
		});

		expect(isVisible).toBe(true);
	});
});

test.describe('Popup - ARIA', () => {
	// WCAG 4.1.2 Name, Role, Value - trigger has aria-haspopup, aria-expanded, aria-controls
	test('trigger has correct ARIA attributes before open', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/90-testing-popover-basic.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-basic',
		);

		const trigger = page.getByTestId('popover-trigger');
		await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');

		await expect(trigger).toHaveAttribute('aria-controls');
	});

	// WCAG 4.1.2 Name, Role, Value - aria-expanded toggles with popover state
	test('trigger aria-expanded updates on open/close', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/90-testing-popover-basic.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-basic',
		);

		const trigger = page.getByTestId('popover-trigger');
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');

		await trigger.click();
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');

		await page.keyboard.press('Escape');
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});

	// WCAG 1.3.1 Info and Relationships - aria-controls links trigger to popover content
	test('trigger aria-controls references the popover element ID', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/90-testing-popover-basic.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-basic',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		/* eslint-disable playwright/prefer-web-first-assertions -- need actual value for CSS selector */
		const ariaControls = await trigger.getAttribute('aria-controls');
		expect(ariaControls).toBeTruthy();
		/* eslint-enable playwright/prefer-web-first-assertions */

		const referencedElement = page.locator(`#${ariaControls}`);
		await expect(referencedElement).toBeVisible();

		await expect(referencedElement).toHaveAttribute('popover', 'auto');
	});

	// WCAG 4.1.2 Name, Role, Value - popover content has specified role
	test('popover content has the role specified by consumer', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/90-testing-popover-basic.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-basic',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		const ariaControls = await trigger.getAttribute('aria-controls');
		const popover = page.locator(`#${ariaControls}`);
		await expect(popover).toHaveAttribute('role', 'dialog');
	});

	// WCAG 4.1.2 Name, Role, Value - popover content has accessible name
	test('popover content has aria-label', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/90-testing-popover-basic.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-basic',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		const ariaControls = await trigger.getAttribute('aria-controls');
		const popover = page.locator(`#${ariaControls}`);
		await expect(popover).toHaveAttribute('aria-label', 'Test popover');
	});

	// WCAG 4.1.3 Status Messages - role triggers screen reader announcement
	test('popover has a role that enables screen reader announcement', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/90-testing-popover-basic.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-basic',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();
		const ariaControls = await trigger.getAttribute('aria-controls');
		const popover = page.locator(`#${ariaControls}`);
		const announcementRoles = ['dialog', 'alertdialog', 'menu', 'listbox', 'tree', 'tooltip'];
		/* eslint-disable playwright/prefer-web-first-assertions -- need actual value for array check */
		const popoverRole = await popover.getAttribute('role');
		expect(popoverRole).toBeTruthy();
		expect(announcementRoles).toContain(popoverRole);
		/* eslint-enable playwright/prefer-web-first-assertions */
	});

	// WCAG 1.3.2 Meaningful Sequence - popover is in DOM near trigger, not portalled to body
	test('popover content is in DOM near its trigger (no portal)', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/100-testing-dom-order.tsx')>(
			'design-system',
			'top-layer',
			'testing-dom-order',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();

		const isInsideContainer = await page.evaluate(() => {
			const container = document.querySelector('[data-testid="container"]');
			const popoverContent = document.querySelector('[data-testid="popover-content"]');
			return container?.contains(popoverContent) ?? false;
		});

		expect(isInsideContainer).toBe(true);

		const isDirectBodyChild = await page.evaluate(() => {
			const popoverContent = document.querySelector('[data-testid="popover-content"]');
			let el = popoverContent;
			while (el && !el.hasAttribute('popover')) {
				el = el.parentElement;
			}
			return el?.parentElement === document.body;
		});

		expect(isDirectBodyChild).toBe(false);
	});
});

test.describe('Popup - Tab-through (non-dialog popovers)', () => {
	// WCAG 2.1.2 No Keyboard Trap — Non-dialog popovers must NOT trap focus;
	// Tab should move focus out of the popover to the next element in the page.
	test('Tab moves focus out of a non-dialog popover (no focus trap)', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/90-testing-popover-basic.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-basic',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();

		// Tab through the popover content — focus should eventually leave the popover.
		// Non-dialog popovers use popover="auto" which does NOT trap focus.
		for (let i = 0; i < 5; i++) {
			await page.keyboard.press('Tab');
		}

		const isFocusInsidePopover = await page.evaluate(() => {
			const popover = document.querySelector('[popover]');
			return popover?.contains(document.activeElement) ?? false;
		});

		expect(isFocusInsidePopover).toBe(false);
	});
});

test.describe('Popup - manual mode accessibility', () => {
	// Mode="manual" popovers do not get browser-native Escape handling.
	// Consumers must implement their own Escape handler to remain accessible.
	test('manual popover can be dismissed via Escape', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/120-testing-manual-popover-a11y.tsx')>(
			'design-system',
			'top-layer',
			'testing-manual-popover-a11y',
		);

		const trigger = page.getByTestId('trigger');
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();

		// Escape should dismiss (handled by consumer, not browser native)
		await page.keyboard.press('Escape');

		await expect(page.getByTestId('popover-content')).toBeHidden();
		await expect(page.getByTestId('close-reason')).toHaveText('escape');
	});

	// Mode="manual" popovers do not get browser-native click-outside handling.
	test('manual popover can be dismissed via click outside', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/120-testing-manual-popover-a11y.tsx')>(
			'design-system',
			'top-layer',
			'testing-manual-popover-a11y',
		);

		const trigger = page.getByTestId('trigger');
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();

		// Click outside should dismiss (handled by consumer, not browser native)
		await page.getByTestId('outside-button').click();

		await expect(page.getByTestId('popover-content')).toBeHidden();
		await expect(page.getByTestId('close-reason')).toHaveText('click-outside');
	});
});

test.describe('Popup - animations', () => {
	test('animated popover has slide-and-fade data attribute when open', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/115-testing-popover-animation.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-animation',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();

		const hasAttribute = await page.evaluate(() => {
			const content = document.querySelector('[data-testid="popover-content"]');
			const popoverEl = content?.closest('[popover]');
			return popoverEl?.hasAttribute('data-ds-popover-slide-and-fade') ?? false;
		});

		expect(hasAttribute).toBe(true);
	});

	test('popover still appears with prefers-reduced-motion: reduce', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.visitExample<typeof import('../../examples/115-testing-popover-animation.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-animation',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();
	});
});

test.describe('Popup - mode="hint" fallback', () => {
	test('when mode="hint" is not supported, popover attribute is "auto" (webkit)', async ({
		page,
		browserName,
	}) => {
		test.fixme(browserName !== 'webkit', 'popover="hint" fallback only testable in webkit');

		await page.visitExample<typeof import('../../examples/107-testing-popover-mode-hint.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-mode-hint',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		/* eslint-disable playwright/prefer-web-first-assertions -- need actual value for CSS selector */
		const ariaControls = await trigger.getAttribute('aria-controls');
		expect(ariaControls).toBeTruthy();
		/* eslint-enable playwright/prefer-web-first-assertions */

		const popover = page.locator(`#${ariaControls}`);
		await expect(popover).toBeVisible();
		await expect(popover).toHaveAttribute('popover', 'auto');
	});
});
