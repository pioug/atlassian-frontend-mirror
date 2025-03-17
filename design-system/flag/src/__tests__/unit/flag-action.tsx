import React from 'react';

import { fireEvent, render, screen, within } from '@testing-library/react';

import noop from '@atlaskit/ds-lib/noop';
import { Box } from '@atlaskit/primitives/compiled';

import Flag from '../../flag';
import { type AppearanceTypes, type FlagProps } from '../../types';

describe('actions prop', () => {
	const generateFlag = (extraProps: Partial<FlagProps>) => (
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		<Flag id="" icon={<Box />} title="Flag" {...extraProps} />
	);

	it('actions with normal appearance should be rendered with dots', () => {
		const actionSpy = jest.fn();
		render(
			generateFlag({
				testId: 'flag-action-test',
				actions: [
					{ content: 'Hello!', onClick: actionSpy },
					{ content: 'Goodbye!', onClick: actionSpy },
					{ content: 'with href', href: 'hrefString' },
				],
			}),
		);

		const actions = screen.getByTestId('flag-action-test-actions');

		expect(actions).toHaveTextContent('Hello!·Goodbye!·with href');
	});

	it('actions with bold appearance should be rendered without dots', () => {
		(['info', 'warning', 'error', 'success'] as Array<AppearanceTypes>).forEach((appearance) => {
			const { unmount } = render(
				generateFlag({
					testId: 'flag-action-test',
					actions: [
						{ content: 'Hello!', onClick: noop },
						{ content: 'Goodbye!', onClick: noop },
						{ content: 'with href', href: 'hrefString' },
					],
					appearance: appearance,
				}),
			);

			fireEvent.click(screen.getByTestId('flag-action-test-toggle'));
			const actions = screen.getByTestId('flag-action-test-actions');

			expect(actions).toHaveTextContent('Hello!Goodbye!with href');

			unmount();
		});
	});

	it('actions without a href should should be rendered as a button', () => {
		render(
			generateFlag({
				testId: 'flag-action-test',
				actions: [{ content: 'Hello!', onClick: noop }],
				appearance: 'error',
			}),
		);

		fireEvent.click(screen.getByTestId('flag-action-test-toggle'));

		const action = within(screen.getByTestId('flag-action-test-actions')).getByRole('button');

		expect(action).toBeInTheDocument();
	});

	it('actions with href should be rendered as an anchor', () => {
		render(
			generateFlag({
				testId: 'flag-action-test',
				actions: [{ content: 'Hello!', onClick: noop, href: 'google.com' }],
			}),
		);

		const action = within(screen.getByTestId('flag-action-test-actions')).getByRole('link');

		expect(action).toBeInTheDocument();
	});

	it('action onClick should be triggered on click', () => {
		const actionSpy = jest.fn();
		render(
			generateFlag({
				testId: 'flag-action-test',
				actions: [
					{ content: 'Hello!', onClick: actionSpy },
					{ content: 'Goodbye!', onClick: actionSpy },
					{ content: 'with href', href: 'hrefString' },
				],
			}),
		);

		fireEvent.click(screen.getByText('Hello!'));

		expect(actionSpy).toHaveBeenCalledTimes(1);
	});

	it('should pass down href and target to the button', () => {
		render(
			generateFlag({
				actions: [
					{
						content: 'Hello!',
						href: 'https://some-unique-url.org',
						target: '_blank',
					},
				],
				description: 'Hi there',
			}),
		);

		const button = screen.getByRole('link', { name: 'Hello!' });

		if (!button) {
			throw new Error('unable to find button');
		}

		expect(button).toHaveAttribute('href', 'https://some-unique-url.org');
		expect(button).toHaveAttribute('target', '_blank');
	});
});
