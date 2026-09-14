import { fireEvent, render, screen } from '@testing-library/react';
import noop from 'lodash/noop';
import React from 'react';
import { ClearIndicator } from '../../../components/ClearIndicator';

const TestClearIndicator = ClearIndicator as React.ComponentType<any>;

jest.mock('@atlaskit/react-select/components', () => ({
	...jest.requireActual('@atlaskit/react-select/components'),
	__esModule: true,
	components: {
		ClearIndicator: ({ innerProps }: { innerProps: React.HTMLAttributes<HTMLButtonElement> }) => (
			<button type="button" aria-label="Clear selection" {...innerProps}>
				Clear
			</button>
		),
	},
}));

jest.mock('@atlaskit/tooltip/Tooltip', () => ({
	...jest.requireActual('@atlaskit/tooltip/Tooltip'),
	__esModule: true,
	default: ({ children, content }: { children: React.ReactNode; content: string }) => (
		<div role="tooltip">
			{content}
			{children}
		</div>
	),
}));

describe('ClearIndicator', () => {
	const renderClearIndicator = (selectProps: Record<string, unknown> = {}) => {
		const parentMouseDown = jest.fn();
		const clearValue = jest.fn();

		const result = render(
			<div onMouseDown={parentMouseDown}>
				<TestClearIndicator
					clearValue={clearValue}
					selectProps={selectProps as any}
					getStyles={noop as any}
					cx={noop as any}
					innerProps={{}}
				/>
			</div>,
		);

		return { ...result, clearValue, parentMouseDown };
	};

	it('clears the value when the indicator is pressed', () => {
		const { clearValue } = renderClearIndicator({ isFocused: true });

		fireEvent.mouseDown(screen.getByRole('button', { name: 'Clear selection' }), { button: 0 });

		expect(clearValue).toHaveBeenCalledTimes(1);
	});

	it('stops the mouse event from propagating when the select is not focused', () => {
		const { clearValue, parentMouseDown } = renderClearIndicator({ isFocused: false });

		fireEvent.mouseDown(screen.getByRole('button', { name: 'Clear selection' }), { button: 0 });

		expect(clearValue).toHaveBeenCalledTimes(1);
		expect(parentMouseDown).not.toHaveBeenCalled();
	});

	it('allows the mouse event to propagate when the select is focused', () => {
		const { parentMouseDown } = renderClearIndicator({ isFocused: true });

		fireEvent.mouseDown(screen.getByRole('button', { name: 'Clear selection' }), { button: 0 });

		expect(parentMouseDown).toHaveBeenCalledTimes(1);
	});

	it('renders a tooltip when a clear value label is supplied', async () => {
		renderClearIndicator({ clearValueLabel: 'Clear selected people' });

		expect(await screen.findByRole('tooltip')).toHaveTextContent('Clear selected people');
		await expect(document.body).toBeAccessible();
	});

	it('does not render a tooltip without a clear value label', () => {
		renderClearIndicator();

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});
});
