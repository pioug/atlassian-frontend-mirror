import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { IconButton } from '../../index';

jest.mock('@atlaskit/tooltip/src/internal/use-unique-id', () => ({
	__esModule: true,
	default: jest
		.fn()
		.mockReturnValueOnce(null)
		.mockReturnValueOnce(null)
		.mockReturnValueOnce(null)
		.mockReturnValueOnce(null)
		.mockReturnValueOnce('uuid'),
}));

describe('<IconButton />', () => {
	it('should pass down test id', () => {
		const label = 'label';
		render(<IconButton tooltip="test" label={label} icon={<div />} testId="icon" />);

		expect(screen.getByTestId('icon')).toBeInTheDocument();
	});

	it('should pass `label` prop to `aria-label`', () => {
		const label = 'label';
		render(<IconButton tooltip={label} label={label} icon={<div />} testId="icon" />);

		expect(screen.getByTestId('icon')).toHaveAttribute('aria-label', label);
	});

	it('can be used with custom components', () => {
		const MyComponent = React.forwardRef(({ href, children, ...rest }: any, ref) => (
			// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
			<a href={href} ref={ref} {...rest} data-testid="custom">
				{children}
			</a>
		));

		const href = 'some/test/path';
		render(
			<IconButton
				tooltip="test"
				icon={<div />}
				testId="icon"
				label="Home"
				component={MyComponent}
				href={href}
			/>,
		);

		expect(screen.queryByTestId('custom')).toHaveAttribute('href', href);
	});

	it('should disable tooltip announcement when isTooltipAnnouncementDisabled is true', async () => {
		const label = 'notifications';
		const tooltip = 'notifications';

		render(
			<IconButton
				tooltip={tooltip}
				label={label}
				icon={<div />}
				testId="icon-button"
				isTooltipAnnouncementDisabled
			/>,
		);

		const button = screen.getByTestId('icon-button');

		await userEvent.hover(button);

		await waitFor(() => {
			expect(button).not.toHaveAttribute('aria-describedby');
		});
		await waitFor(() => {
			expect(button).toHaveAttribute('aria-label', 'notifications');
		});
	});

	it('should enable tooltip and label announcements when isTooltipAnnouncementDisabled is false', async () => {
		const label = 'notifications';
		const tooltip = 'notifications';

		render(<IconButton tooltip={tooltip} label={label} icon={<div />} testId="icon-button" />);

		const button = screen.getByTestId('icon-button');

		await userEvent.hover(button);

		await waitFor(() => {
			expect(button).toHaveAttribute('aria-describedby', 'uuid');
		});
		await waitFor(() => {
			expect(button).toHaveAttribute('aria-label', 'notifications');
		});
	});
});
