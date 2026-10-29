/* eslint-disable @atlaskit/ui-styling-standard/enforce-style-prop -- Regression tests intentionally exercise consumer style overrides. */
import React from 'react';

import { render, screen } from '@testing-library/react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import TextArea from '../../text-area';

describe('atomic textarea styles', () => {
	it('preserves state attributes and arbitrary row counts with atomic styles disabled', async () => {
		failGate('platform-textarea-atomic-styles');
		const { container, rerender } = render(
			<TextArea aria-label="Description" minimumRows={7} resize="none" />,
		);
		const input = screen.getByRole('textbox');
		expect(input).toHaveAttribute('rows', '7');
		expect(input).toHaveCompiledCss('min-height', '154px', {
			target: ':not([data-compact])',
		});
		rerender(
			<TextArea aria-label="Description" minimumRows={7} resize="none" isCompact isInvalid />,
		);
		expect(input).toHaveAttribute('data-compact', 'true');
		expect(input).toHaveAttribute('data-invalid', 'true');
		expect(input).toHaveCompiledCss('min-height', '118px', {
			target: '[data-compact]',
		});
		rerender(<TextArea aria-label="Description" minimumRows={3} resize="none" appearance="none" />);
		expect(input).not.toHaveAttribute('data-compact');
		expect(input).not.toHaveAttribute('data-invalid');
		await expect(container).toBeAccessible();
	});

	it('omits styling attributes and preserves arbitrary row counts with atomic styles enabled', async () => {
		passGate('platform-textarea-atomic-styles');
		const { container, rerender } = render(
			<TextArea aria-label="Description" minimumRows={7} resize="none" />,
		);
		const input = screen.getByRole('textbox');
		expect(input).toHaveAttribute('rows', '7');
		expect(input).toHaveStyle({ minHeight: '154px' });
		rerender(
			<TextArea aria-label="Description" minimumRows={7} resize="none" isCompact isInvalid />,
		);
		expect(input).not.toHaveAttribute('data-compact');
		expect(input).not.toHaveAttribute('data-invalid');
		expect(input).toHaveStyle({ minHeight: '118px' });
		expect(input.style.lineHeight).toBe(String(16 / 14));
		expect(input).toHaveCompiledCss('border-color', 'var(--ds-border-danger,#e2483d)');
		rerender(<TextArea aria-label="Description" minimumRows={3} resize="none" appearance="none" />);
		expect(input).not.toHaveAttribute('data-compact');
		expect(input).not.toHaveAttribute('data-invalid');
		expect(input).toHaveStyle({ minHeight: '76px' });
		await expect(container).toBeAccessible();
	});

	it('preserves and removes a consumer minimum height across density changes', async () => {
		passGate('platform-textarea-atomic-styles');
		const { container, rerender } = render(
			<TextArea
				aria-label="Description"
				minimumRows={7}
				resize="none"
				style={{ minHeight: 200 }}
			/>,
		);
		const input = screen.getByRole('textbox');
		expect(input).toHaveStyle({ minHeight: '200px' });
		rerender(
			<TextArea
				aria-label="Description"
				minimumRows={7}
				resize="none"
				isCompact
				style={{ minHeight: 200 }}
			/>,
		);
		expect(input).toHaveStyle({ minHeight: '200px' });
		rerender(<TextArea aria-label="Description" minimumRows={7} resize="none" isCompact />);
		expect(input).toHaveStyle({ minHeight: '118px' });
		await expect(container).toBeAccessible();
	});

	it('preserves and removes a consumer font across density changes', async () => {
		passGate('platform-textarea-atomic-styles');
		const { container, rerender } = render(
			<TextArea aria-label="Description" resize="none" style={{ font: '16px/24px monospace' }} />,
		);
		const input = screen.getByRole('textbox');
		const consumerFont = input.style.font;
		// jsdom does not expand font shorthands; density must not add a competing longhand.
		expect(consumerFont).not.toBe('');
		expect(input).toHaveStyle({ lineHeight: '' });
		rerender(
			<TextArea
				aria-label="Description"
				resize="none"
				isCompact
				style={{ font: '16px/24px monospace' }}
			/>,
		);
		expect(input).toHaveStyle({ font: consumerFont });
		expect(input).toHaveStyle({ lineHeight: '' });
		rerender(<TextArea aria-label="Description" resize="none" isCompact />);
		expect(input.style.lineHeight).toBe(String(16 / 14));
		await expect(container).toBeAccessible();
	});
});
