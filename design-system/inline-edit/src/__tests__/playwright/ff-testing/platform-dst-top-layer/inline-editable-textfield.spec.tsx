import { expect, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

test.describe('InlineEditableTextfield top-layer: validation message', () => {
	test('focus stays in the field while the message is open and the user types', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../../../../examples/04-inline-editable-textfield.tsx')
		>('design-system', 'inline-edit', 'inline-editable-textfield', {
			featureFlag,
			'react-18-mode': 'modern',
		});

		await page.getByText('Field value').click();
		const input = page.getByRole('textbox', { name: 'Inline editable textfield' });
		const message = page.getByText('Enter a value longer than 6 characters');
		await expect(input).toBeFocused();

		// An invalid value opens the message. Focus stays in the field.
		await page.keyboard.press('ControlOrMeta+A');
		await page.keyboard.press('Backspace');
		await expect(message).toBeVisible();
		await expect(input).toBeFocused();

		// Typing goes on in the field while the value is still invalid.
		await page.keyboard.type('Abcdef');
		await expect(input).toHaveValue('Abcdef');
		await expect(message).toBeVisible();
		await expect(input).toBeFocused();

		// A valid value closes the message. Focus stays in the field.
		await page.keyboard.type('g');
		await expect(message).toBeHidden();
		await expect(input).toHaveValue('Abcdefg');
		await expect(input).toBeFocused();
	});
});
