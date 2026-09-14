import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Link from '../../../../react/marks/link';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import '@atlaskit/link-test-helpers/jest';

describe('Renderer - React/Marks/Link', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	const renderLink = () =>
		render(
			<Link
				dataAttributes={{ 'data-renderer-mark': true }}
				href="https://www.atlassian.com"
				target="_blank"
			>
				This is a link
			</Link>,
		);

	it('should capture and report a11y violations', async () => {
		const { container } = renderLink();

		await expect(container).toBeAccessible();
	});

	it('should wrap content with <a>-tag', () => {
		renderLink();

		expect(screen.getByRole('link')).toBeInTheDocument();
	});

	it('should set href to attrs.href', () => {
		renderLink();

		expect(screen.getByRole('link')).toHaveAttribute('href', 'https://www.atlassian.com');
	});

	it('should set target to _blank', () => {
		renderLink();

		expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
	});

	it('should not set target by default', () => {
		render(
			<Link dataAttributes={{ 'data-renderer-mark': true }} href="https://www.atlassian.com">
				This is a link
			</Link>,
		);

		expect(screen.getByRole('link')).not.toHaveAttribute('target');
	});

	it('should set target to whatever props.target was', () => {
		render(
			<Link
				dataAttributes={{ 'data-renderer-mark': true }}
				href="https://www.atlassian.com"
				target="_top"
			>
				This is a link
			</Link>,
		);

		expect(screen.getByRole('link')).toHaveAttribute('target', '_top');
	});

	it('should set safety rel on links with target _blank', () => {
		renderLink();

		expect(screen.getByRole('link')).toHaveAttribute('rel', 'noreferrer noopener');
	});

	it('should not set safety rel on links with target _blank', () => {
		render(
			<Link
				dataAttributes={{ 'data-renderer-mark': true }}
				href="https://www.atlassian.com"
				target="_top"
			>
				This is a link
			</Link>,
		);

		expect(screen.getByRole('link')).not.toHaveAttribute('rel');
	});

	it('should set onClick handler when isMediaLink is false', async () => {
		// the handler is not visible in the DOM, so it is exercised through a click
		const onClick = jest.fn();
		render(
			<Link
				dataAttributes={{ 'data-renderer-mark': true }}
				href="https://www.atlassian.com"
				target="_blank"
				eventHandlers={{ link: { onClick } }}
			>
				This is a link
			</Link>,
		);

		await userEvent.click(screen.getByRole('link'));

		expect(onClick).toHaveBeenCalledWith(expect.anything(), 'https://www.atlassian.com');
	});

	it('should only render children without wrapping <a> when isMediaLink is true', () => {
		const { container } = render(
			<Link
				dataAttributes={{ 'data-renderer-mark': true }}
				href="https://www.atlassian.com"
				target="_top"
				isMediaLink
			>
				<div>test</div>
			</Link>,
		);

		expect(container.firstElementChild?.tagName).toEqual('DIV');
		expect(container.querySelector('a')).not.toBeInTheDocument();
	});

	describe('onSetLinkTarget functionality', () => {
		it('should use original target when no onSetLinkTarget callback is provided', () => {
			render(
				<Link
					dataAttributes={{ 'data-renderer-mark': true }}
					href="https://www.atlassian.com?deepLinkTarget=confluence"
					target="_self"
				>
					This is a link
				</Link>,
			);

			expect(screen.getByRole('link')).toHaveAttribute('target', '_self');
		});

		it('should use original target when callback returns undefined', () => {
			const mockCallback = jest.fn().mockReturnValue(undefined);
			render(
				<Link
					dataAttributes={{ 'data-renderer-mark': true }}
					href="https://www.atlassian.com"
					target="_self"
					onSetLinkTarget={mockCallback}
				>
					This is a link
				</Link>,
			);

			expect(mockCallback).toHaveBeenCalledWith('https://www.atlassian.com');
			expect(screen.getByRole('link')).toHaveAttribute('target', '_self');
		});

		it('should use callback return value when callback returns _blank', () => {
			const mockCallback = jest.fn().mockReturnValue('_blank');
			render(
				<Link
					dataAttributes={{ 'data-renderer-mark': true }}
					href="https://www.atlassian.com?deepLinkTarget=jira"
					target="_self"
					onSetLinkTarget={mockCallback}
				>
					This is a link
				</Link>,
			);

			expect(mockCallback).toHaveBeenCalledWith('https://www.atlassian.com?deepLinkTarget=jira');
			expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
		});

		it('should override target to _blank when callback returns _blank', () => {
			const mockCallback = jest.fn().mockReturnValue('_blank');
			render(
				<Link
					dataAttributes={{ 'data-renderer-mark': true }}
					href="https://www.atlassian.com?deepLinkTarget=confluence"
					target="_self"
					onSetLinkTarget={mockCallback}
				>
					This is a link
				</Link>,
			);

			expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
		});

		it('should override target to _blank even when no original target is set', () => {
			const mockCallback = jest.fn().mockReturnValue('_blank');
			render(
				<Link
					dataAttributes={{ 'data-renderer-mark': true }}
					href="https://www.atlassian.com?deepLinkTarget=admin"
					onSetLinkTarget={mockCallback}
				>
					This is a link
				</Link>,
			);

			expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
		});

		it('should pass the correct URL to callback with multiple query parameters', () => {
			const mockCallback = jest.fn().mockReturnValue('_blank');
			const testUrl = 'https://www.atlassian.com?foo=bar&deepLinkTarget=confluence&baz=qux';
			render(
				<Link
					dataAttributes={{ 'data-renderer-mark': true }}
					href={testUrl}
					onSetLinkTarget={mockCallback}
				>
					This is a link
				</Link>,
			);

			expect(mockCallback).toHaveBeenCalledWith(testUrl);
			expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
		});

		it('should set safety rel when callback returns _blank', () => {
			const mockCallback = jest.fn().mockReturnValue('_blank');
			render(
				<Link
					dataAttributes={{ 'data-renderer-mark': true }}
					href="https://www.atlassian.com?deepLinkTarget=confluence"
					target="_self"
					onSetLinkTarget={mockCallback}
				>
					This is a link
				</Link>,
			);

			const link = screen.getByRole('link');

			expect(link).toHaveAttribute('target', '_blank');
			expect(link).toHaveAttribute('rel', 'noreferrer noopener');
		});

		it('should handle callback errors gracefully and use original target', () => {
			const mockCallback = jest.fn().mockImplementation(() => {
				throw new Error('Callback error');
			});
			render(
				<Link
					dataAttributes={{ 'data-renderer-mark': true }}
					href="not-a-valid-url"
					target="_self"
					onSetLinkTarget={mockCallback}
				>
					This is a link
				</Link>,
			);

			expect(mockCallback).toHaveBeenCalledWith('not-a-valid-url');
			expect(screen.getByRole('link')).toHaveAttribute('target', '_self');
		});

		it('should call callback with relative URLs', () => {
			const mockCallback = jest.fn().mockReturnValue(undefined);
			const testUrl = '/relative/path?deepLinkTarget=confluence';
			render(
				<Link
					dataAttributes={{ 'data-renderer-mark': true }}
					href={testUrl}
					target="_self"
					onSetLinkTarget={mockCallback}
				>
					This is a link
				</Link>,
			);

			expect(mockCallback).toHaveBeenCalledWith(testUrl);
			expect(screen.getByRole('link')).toHaveAttribute('target', '_self');
		});

		it('should work with different callback return scenarios', () => {
			const testCases = [
				{ returnValue: '_blank', expectedTarget: '_blank' },
				{ returnValue: undefined, expectedTarget: undefined },
				{ returnValue: undefined, expectedTarget: '_self', originalTarget: '_self' },
				{ returnValue: '_blank', expectedTarget: '_blank', originalTarget: '_top' },
			];

			testCases.forEach(({ returnValue, expectedTarget, originalTarget }) => {
				const mockCallback = jest.fn().mockReturnValue(returnValue);
				// each case is unmounted so only one link is in the document at a time
				const { container, unmount } = render(
					<Link
						dataAttributes={{ 'data-renderer-mark': true }}
						href={`https://example.com?test=value`}
						target={originalTarget}
						onSetLinkTarget={mockCallback}
					>
						Test link
					</Link>,
				);

				const link = container.querySelector('a');

				if (expectedTarget === undefined) {
					expect(link).not.toHaveAttribute('target');
				} else {
					expect(link).toHaveAttribute('target', expectedTarget);
				}

				unmount();
			});
		});

		it('should call callback only once per render', () => {
			const mockCallback = jest.fn().mockReturnValue('_blank');
			render(
				<Link
					dataAttributes={{ 'data-renderer-mark': true }}
					href="https://www.atlassian.com?deepLinkTarget=JIRA"
					onSetLinkTarget={mockCallback}
				>
					This is a link
				</Link>,
			);

			expect(mockCallback).toHaveBeenCalledTimes(1);
		});
	});

	describe('analytics', () => {
		it('fires on click', async () => {
			const fireAnalyticsEvent = jest.fn();
			const analyticsSpy = jest.fn();
			const expectedContext = [
				{
					attributes: {
						location: 'renderer',
					},
					location: 'renderer',
				},
			];
			render(
				<AnalyticsListener onEvent={analyticsSpy} channel={'media'}>
					<Link
						dataAttributes={{ 'data-renderer-mark': true }}
						href="https://www.atlassian.com"
						target="_top"
						fireAnalyticsEvent={fireAnalyticsEvent}
					>
						Sail ho shrouds spirits.
					</Link>
					,
				</AnalyticsListener>,
			);

			fireAnalyticsEvent.mockClear();

			await userEvent.click(screen.getByRole('link'));

			expect(fireAnalyticsEvent).toHaveBeenCalledWith({
				action: 'visited',
				actionSubject: 'link',
				attributes: {
					platform: 'web',
					mode: 'renderer',
				},
				eventType: 'track',
			});
			expect(analyticsSpy).toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'clicked',
					actionSubject: 'link',
				},
				context: expectedContext,
			});
		});
	});
});
