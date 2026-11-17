import React from 'react';

import { render, screen } from '@testing-library/react';

import Textfield from '../../text-field';

describe('atomic input spacing', () => {
	it('preserves compact spacing changes', async () => {
		const { container, rerender } = render(<Textfield aria-label="Name" />);
		const input = screen.getByRole('textbox');
		expect(input).toHaveCompiledCss('padding-block-start', 'var(--ds-space-100,8px)');
		expect(input).toHaveCompiledCss('padding-inline-start', 'var(--ds-space-075,6px)');
		expect(input).toHaveCompiledCss('padding-inline-end', 'var(--ds-space-075,6px)');
		rerender(<Textfield aria-label="Name" isCompact />);
		expect(input).not.toHaveAttribute('data-compact');
		expect(input).toHaveCompiledCss('padding-block-start', 'var(--ds-space-050,4px)');
		expect(input).toHaveCompiledCss('padding-inline-start', 'var(--ds-space-075,6px)');
		expect(input).toHaveCompiledCss('padding-inline-end', 'var(--ds-space-075,6px)');
		expect(input).toHaveCompiledCss('padding-block-start', 'var(--ds-space-025,2px)', {
			media: '(pointer: coarse) and (max-width: 30rem)',
		});
		rerender(<Textfield aria-label="Name" />);
		expect(input).not.toHaveAttribute('data-compact');
		expect(input).toHaveCompiledCss('padding-block-start', 'var(--ds-space-100,8px)');
		await expect(container).toBeAccessible();
	});
});
