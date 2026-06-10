import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';
import React from 'react';
import { screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HeadingAnchor from '../../../../react/nodes/heading-anchor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: jest.fn(),
}));

import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
const mockExpValEquals = expValEquals as jest.MockedFunction<typeof expValEquals>;

describe('Heading Anchor', () => {
	const onClickHandler = () => Promise.resolve();

	it('should render a tooltip with a meaningful message on hover', async () => {
		act(() => {
			renderWithIntl(<HeadingAnchor onCopyText={() => Promise.resolve()} level={1} />);
		});

		const copyLinkButton = screen.getByRole('button', {
			name: 'Copy link to heading',
		});
		expect(copyLinkButton).toBeVisible();

		await userEvent.hover(copyLinkButton);
		await waitFor(() => expect(screen.getByRole('tooltip', { name: 'Copy link to heading' })));
	});

	it('should update the tooltip with a meaningful message when the user has clicked the copy button', async () => {
		act(() => {
			renderWithIntl(<HeadingAnchor onCopyText={onClickHandler} level={1} />);
		});

		await userEvent.click(
			screen.getByRole('button', {
				name: 'Copy link to heading',
			}),
		);

		const copiedButton = await screen.findByRole('button', { name: 'Copied!' });
		await waitFor(() => expect(copiedButton).toBeVisible());

		await userEvent.hover(copiedButton);
		await waitFor(() => expect(screen.getByRole('tooltip', { name: 'Copied!' })).toBeVisible());
	});

	test('when hideFromScreenReader is true, it should hide the button from screen readers, and be tabbable', () => {
		act(() => {
			renderWithIntl(
				<HeadingAnchor level={1} hideFromScreenReader={true} onCopyText={jest.fn()} />,
			);
		});
		const anchorButton = screen.getByTestId('anchor-button');
		expect(anchorButton).toHaveAttribute('aria-hidden', 'true');
		expect(anchorButton).not.toHaveAttribute('tabindex');
		expect(anchorButton).not.toHaveAttribute('aria-label');
	});

	it('when hideFromScreenReader is not provided, it should be accessible, have the correct aria-label, but not be tabbable', () => {
		act(() => {
			renderWithIntl(<HeadingAnchor level={1} onCopyText={jest.fn()} />);
		});

		const anchorButton = screen.getByTestId('anchor-button');
		expect(anchorButton).toHaveAttribute('aria-hidden', 'false');
		expect(anchorButton).toHaveAttribute('tabindex', '-1');
		expect(anchorButton).toHaveAttribute('aria-label', 'Copy link to heading');
	});

	describe('a11y-fixes-week4-may-2026 experiment', () => {
		describe('when experiment is ON', () => {
			beforeEach(() => {
				mockExpValEquals.mockImplementation((expName: string) => {
					if (expName === 'a11y-fixes-week4-may-2026') {
						return true;
					}
					return false;
				});
			});

			it('should retain focus on the button after clicking copy (no Tooltip remount)', async () => {
				act(() => {
					renderWithIntl(<HeadingAnchor onCopyText={onClickHandler} level={1} />);
				});

				const copyButton = screen.getByRole('button', { name: 'Copy link to heading' });
				copyButton.focus();
				expect(document.activeElement).toBe(copyButton);

				await userEvent.click(copyButton);

				// After click, the button should still be in the DOM (no remount)
				// and the tooltip message should update to "Copied!"
				const copiedButton = await screen.findByRole('button', { name: 'Copied!' });
				expect(copiedButton).toBeVisible();
				expect(copiedButton).toBe(copyButton);
				expect(document.activeElement).toBe(copiedButton);
			});

			it('should render tooltip with a meaningful message on hover', async () => {
				act(() => {
					renderWithIntl(<HeadingAnchor onCopyText={() => Promise.resolve()} level={1} />);
				});

				const copyLinkButton = screen.getByRole('button', {
					name: 'Copy link to heading',
				});
				expect(copyLinkButton).toBeVisible();

				await userEvent.hover(copyLinkButton);
				await waitFor(() =>
					expect(screen.getByRole('tooltip', { name: 'Copy link to heading' })),
				);
			});

			it('should update the tooltip message after copy without unmounting the button', async () => {
				act(() => {
					renderWithIntl(<HeadingAnchor onCopyText={onClickHandler} level={1} />);
				});

				const copyButton = screen.getByRole('button', { name: 'Copy link to heading' });
				await userEvent.click(copyButton);

				const copiedButton = await screen.findByRole('button', { name: 'Copied!' });
				await waitFor(() => expect(copiedButton).toBeVisible());

				await userEvent.hover(copiedButton);
				await waitFor(() =>
					expect(screen.getByRole('tooltip', { name: 'Copied!' })).toBeVisible(),
				);
			});
		});

		describe('when experiment is OFF', () => {
			beforeEach(() => {
				mockExpValEquals.mockImplementation(() => {
					return false;
				});
			});

			it('should render tooltip with a meaningful message on hover', async () => {
				act(() => {
					renderWithIntl(<HeadingAnchor onCopyText={() => Promise.resolve()} level={1} />);
				});

				const copyLinkButton = screen.getByRole('button', {
					name: 'Copy link to heading',
				});
				expect(copyLinkButton).toBeVisible();

				await userEvent.hover(copyLinkButton);
				await waitFor(() =>
					expect(screen.getByRole('tooltip', { name: 'Copy link to heading' })),
				);
			});

			it('should remount the button on copy and not retain focus', async () => {
				act(() => {
					renderWithIntl(<HeadingAnchor onCopyText={onClickHandler} level={1} />);
				});

				const copyButton = screen.getByRole('button', {
					name: 'Copy link to heading',
				});
				copyButton.focus();
				expect(document.activeElement).toBe(copyButton);

				await userEvent.click(copyButton);

				const copiedButton = await screen.findByRole('button', { name: 'Copied!' });
				await waitFor(() => expect(copiedButton).toBeVisible());
				expect(copiedButton).not.toBe(copyButton);
				expect(document.activeElement).not.toBe(copiedButton);

				await userEvent.hover(copiedButton);
				await waitFor(() =>
					expect(screen.getByRole('tooltip', { name: 'Copied!' })).toBeVisible(),
				);
			});
		});
	});
});
