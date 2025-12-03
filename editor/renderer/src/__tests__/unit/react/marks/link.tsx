import React from 'react';
import { mount } from 'enzyme';
import Link from '../../../../react/marks/link';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import '@atlaskit/link-test-helpers/jest';

// Mock the feature flag
jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

import { fg } from '@atlaskit/platform-feature-flags';
const mockFg = fg as jest.MockedFunction<typeof fg>;

describe('Renderer - React/Marks/Link', () => {
	beforeEach(() => {
		mockFg.mockReset();
		mockFg.mockImplementation((flag: string) => {
			if (flag === 'rovo_chat_deep_linking_enabled') {
				return false;
			}
			return true;
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	const createLink = () =>
		mount(
			<Link
				dataAttributes={{ 'data-renderer-mark': true }}
				href="https://www.atlassian.com"
				target="_blank"
			>
				This is a link
			</Link>,
		);

	it('should wrap content with <a>-tag', () => {
		const mark = createLink();
		expect(mark.find('a').length).toEqual(1);
		mark.unmount();
	});

	it('should set href to attrs.href', () => {
		const mark = createLink();
		expect(mark.find('a').props()).toHaveProperty('href', 'https://www.atlassian.com');
		mark.unmount();
	});

	it('should set target to _blank', () => {
		const mark = createLink();
		expect(mark.find('a').props()).toHaveProperty('target', '_blank');
		mark.unmount();
	});

	it('should not set target by default', () => {
		const mark = mount(
			<Link dataAttributes={{ 'data-renderer-mark': true }} href="https://www.atlassian.com">
				This is a link
			</Link>,
		);
		expect(mark.find('a').props()).toHaveProperty('target', undefined);
		mark.unmount();
	});

	it('should set target to whatever props.target was', () => {
		const mark = mount(
			<Link
				dataAttributes={{ 'data-renderer-mark': true }}
				href="https://www.atlassian.com"
				target="_top"
			>
				This is a link
			</Link>,
		);
		expect(mark.find('a').props()).toHaveProperty('target', '_top');
		mark.unmount();
	});

	it('should set safety rel on links with target _blank', () => {
		const mark = createLink();
		expect(mark.find('a').props()).toHaveProperty('rel', 'noreferrer noopener');
		mark.unmount();
	});

	it('should not set safety rel on links with target _blank', () => {
		const mark = mount(
			<Link
				dataAttributes={{ 'data-renderer-mark': true }}
				href="https://www.atlassian.com"
				target="_top"
			>
				This is a link
			</Link>,
		);
		expect(mark.find('a').props()).not.toHaveProperty('rel');
		mark.unmount();
	});

	it('should set onClick handler when isMediaLink is false', () => {
		const mark = createLink();
		expect(mark.find('a').props()).toHaveProperty('onClick');
		mark.unmount();
	});

	it('should only render children without wrapping <a> when isMediaLink is true', () => {
		const mark = mount(
			<Link
				dataAttributes={{ 'data-renderer-mark': true }}
				href="https://www.atlassian.com"
				target="_top"
				isMediaLink
			>
				<div>test</div>
			</Link>,
		);

		expect(mark.getDOMNode().tagName).toEqual('DIV');
		mark.unmount();
	});

	describe('onSetLinkTarget functionality', () => {
		describe('when feature flag is enabled', () => {
			beforeEach(() => {
				mockFg.mockImplementation((flag: string) => {
					if (flag === 'rovo_chat_deep_linking_enabled') {
						return true;
					}
					return false;
				});
			});

			it('should use original target when no onSetLinkTarget callback is provided', () => {
				const mark = mount(
					<Link
						dataAttributes={{ 'data-renderer-mark': true }}
						href="https://www.atlassian.com?deepLinkTarget=confluence"
						target="_self"
					>
						This is a link
					</Link>,
				);
				expect(mark.find('a').props()).toHaveProperty('target', '_self');
				mark.unmount();
			});

			it('should use original target when callback returns undefined', () => {
				const mockCallback = jest.fn().mockReturnValue(undefined);
				const mark = mount(
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
				expect(mark.find('a').props()).toHaveProperty('target', '_self');
				mark.unmount();
			});

			it('should use callback return value when callback returns _blank', () => {
				const mockCallback = jest.fn().mockReturnValue('_blank');
				const mark = mount(
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
				expect(mark.find('a').props()).toHaveProperty('target', '_blank');
				mark.unmount();
			});

			it('should override target to _blank when callback returns _blank', () => {
				const mockCallback = jest.fn().mockReturnValue('_blank');
				const mark = mount(
					<Link
						dataAttributes={{ 'data-renderer-mark': true }}
						href="https://www.atlassian.com?deepLinkTarget=confluence"
						target="_self"
						onSetLinkTarget={mockCallback}
					>
						This is a link
					</Link>,
				);
				expect(mark.find('a').props()).toHaveProperty('target', '_blank');
				mark.unmount();
			});

			it('should override target to _blank even when no original target is set', () => {
				const mockCallback = jest.fn().mockReturnValue('_blank');
				const mark = mount(
					<Link
						dataAttributes={{ 'data-renderer-mark': true }}
						href="https://www.atlassian.com?deepLinkTarget=admin"
						onSetLinkTarget={mockCallback}
					>
						This is a link
					</Link>,
				);
				expect(mark.find('a').props()).toHaveProperty('target', '_blank');
				mark.unmount();
			});

			it('should pass the correct URL to callback with multiple query parameters', () => {
				const mockCallback = jest.fn().mockReturnValue('_blank');
				const testUrl = 'https://www.atlassian.com?foo=bar&deepLinkTarget=confluence&baz=qux';
				const mark = mount(
					<Link
						dataAttributes={{ 'data-renderer-mark': true }}
						href={testUrl}
						onSetLinkTarget={mockCallback}
					>
						This is a link
					</Link>,
				);
				expect(mockCallback).toHaveBeenCalledWith(testUrl);
				expect(mark.find('a').props()).toHaveProperty('target', '_blank');
				mark.unmount();
			});

			it('should set safety rel when callback returns _blank', () => {
				const mockCallback = jest.fn().mockReturnValue('_blank');
				const mark = mount(
					<Link
						dataAttributes={{ 'data-renderer-mark': true }}
						href="https://www.atlassian.com?deepLinkTarget=confluence"
						target="_self"
						onSetLinkTarget={mockCallback}
					>
						This is a link
					</Link>,
				);
				expect(mark.find('a').props()).toHaveProperty('target', '_blank');
				expect(mark.find('a').props()).toHaveProperty('rel', 'noreferrer noopener');
				mark.unmount();
			});

			it('should handle callback errors gracefully and use original target', () => {
				const mockCallback = jest.fn().mockImplementation(() => {
					throw new Error('Callback error');
				});
				const mark = mount(
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
				expect(mark.find('a').props()).toHaveProperty('target', '_self');
				mark.unmount();
			});

			it('should call callback with relative URLs', () => {
				const mockCallback = jest.fn().mockReturnValue(undefined);
				const testUrl = '/relative/path?deepLinkTarget=confluence';
				const mark = mount(
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
				expect(mark.find('a').props()).toHaveProperty('target', '_self');
				mark.unmount();
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
					const mark = mount(
						<Link
							dataAttributes={{ 'data-renderer-mark': true }}
							href={`https://example.com?test=value`}
							target={originalTarget}
							onSetLinkTarget={mockCallback}
						>
							Test link
						</Link>,
					);

					expect(mark.find('a').props()).toHaveProperty('target', expectedTarget);
					mark.unmount();
				});
			});

			it('should call callback only once per render', () => {
				const mockCallback = jest.fn().mockReturnValue('_blank');
				const mark = mount(
					<Link
						dataAttributes={{ 'data-renderer-mark': true }}
						href="https://www.atlassian.com?deepLinkTarget=JIRA"
						onSetLinkTarget={mockCallback}
					>
						This is a link
					</Link>,
				);
				expect(mockCallback).toHaveBeenCalledTimes(1);
				mark.unmount();
			});
		});

		describe('when feature flag is disabled', () => {
			beforeEach(() => {
				mockFg.mockImplementation((flag: string) => {
					if (flag === 'rovo_chat_deep_linking_enabled') {
						return false;
					}
					return false;
				});
			});

			it('should ignore onSetLinkTarget callback and use original target when flag is disabled', () => {
				const mockCallback = jest.fn().mockReturnValue('_blank');
				const mark = mount(
					<Link
						dataAttributes={{ 'data-renderer-mark': true }}
						href="https://www.atlassian.com?deepLinkTarget=confluence"
						target="_self"
						onSetLinkTarget={mockCallback}
					>
						This is a link
					</Link>,
				);
				// Callback should not be called when feature flag is disabled
				expect(mockCallback).not.toHaveBeenCalled();
				expect(mark.find('a').props()).toHaveProperty('target', '_self');
				mark.unmount();
			});

			it('should not call callback when feature flag is disabled', () => {
				const mockCallback = jest.fn().mockReturnValue('_blank');
				const mark = mount(
					<Link
						dataAttributes={{ 'data-renderer-mark': true }}
						href="https://www.atlassian.com?deepLinkTarget=admin"
						onSetLinkTarget={mockCallback}
					>
						This is a link
					</Link>,
				);
				expect(mockCallback).not.toHaveBeenCalled();
				expect(mark.find('a').props()).toHaveProperty('target', undefined);
				mark.unmount();
			});
		});
	});

	describe('analytics', () => {
		it('fires on click', () => {
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
			const linkAroundText = mount(
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
			linkAroundText.find('a').simulate('click');

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
