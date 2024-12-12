import React, { type ComponentProps } from 'react';

import '@atlaskit/link-test-helpers/jest';

import { act, createEvent, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AnalyticsListener } from '@atlaskit/analytics-next';

import { ANALYTICS_CHANNEL } from '../../../utils/analytics';
import LinkUrl from '../../LinkUrl';

describe('LinkUrl', () => {
	let LinkUrlTestId: string = 'link-with-safety';
	let originalWindowOpen: typeof window.open;

	beforeAll(() => {
		originalWindowOpen = window.open;
		window.open = jest.fn();
		jsdom.reconfigure({
			url: 'https://my-website.com',
		});
	});

	afterAll(() => {
		window.open = originalWindowOpen;
	});

	const checkWarningPresence = (
		linkUrl: string,
		linkText: string,
		checkSafety: boolean,
		shouldShowModalDialog: boolean,
	) => {
		render(
			<LinkUrl href={linkUrl} checkSafety={checkSafety}>
				{linkText}
			</LinkUrl>,
		);
		const linkUrlView = screen.getByTestId(LinkUrlTestId);
		const event = createEvent.click(linkUrlView);
		fireEvent(linkUrlView, event);
		const isLinkUnsafe = !!screen.queryByText('Check this link');

		expect(isLinkUnsafe).toBe(shouldShowModalDialog);
		if (shouldShowModalDialog) {
			expect(event.defaultPrevented).toBe(true);
		} else {
			expect(event.defaultPrevented).toBe(false);
		}
	};

	describe.each<[string, string, string]>([
		['link text is a url pointing to a different place', 'https://some.url', 'https://another.url'],
		['link text is a different relative path', 'https://some.url/something', '/somethingElse'],
		[
			'link text query part differs',
			'https://some.url/path/my?query=10',
			'https://some.url/path/my?query=20',
		],
		[
			'protocol differs between http and https with username and password present',
			'http://sasha:password@some.url/path/my?query=10',
			'https://sasha:password@some.url/path/my?query=10',
		],
		['protocol differs between non http and https', 'ftp://some.url', 'http://some.url'],
		[
			'username and password differs',
			'http://sasha:password@some.url/path/my?query=10',
			'http://pasha:secret@some.url/path/my?query=10',
		],
		["link url doesn't have explicit protocol", 'www.youtube.com', 'atlassian.com/smart-cards'],
	])('when %s', (_, linkUrl, linkText) => {
		it('should show safety warning message', () => {
			checkWarningPresence(linkUrl, linkText, true, true);
		});
	});

	describe.each<[string, string, string, boolean]>([
		['link text is not url', 'https://some.url', 'link text', true],
		['link text is a url pointing to the same place', 'https://some.url', 'https://some.url', true],
		['safety is off', 'https://some.url', 'https://another.url', false],
		['link text starts with hashtag', 'https://some.url', '#something', true],
		[
			'link text contains relative path of underlying url',
			'https://some.url/something/there',
			'/something/there',
			true,
		],
		[
			"link text doesn't have hashtag while original url does",
			'https://some.url/something/there#hastag',
			'https://some.url/something/there',
			true,
		],
		[
			"link actual url doesn't have hashtag while text url does",
			'https://some.url/something/there',
			'https://some.url/something/there#hashtag',
			true,
		],
		[
			'relative path inside a link matched full link in title',
			'relative-path',
			'https://my-website.com/relative-path',
			true,
		],
		[
			'relative path inside a link matched full link in title 2',
			'/relative-path',
			'https://my-website.com/relative-path',
			true,
		],
		[
			'relative path inside a link matched not match full link in title',
			'/relative-path',
			'https://my-website.com/other-relative-path',
			true,
		],
		[
			'protocol differs without username and password present',
			'http://some.url/path/my?query=10',
			'https://some.url/path/my?query=10',
			true,
		],
		[
			'relative path inside a link matched full link in title 3',
			'/relative-path',
			'my-website.com/relative-path',
			true,
		],
	])('when %s', (_, linkUrl, linkText, checkSafety) => {
		it('should not show safety warning message', () => {
			checkWarningPresence(linkUrl, linkText, checkSafety, false);
		});
	});

	describe('when user open safety warning dialog', () => {
		const setup = () => {
			const onEvent = jest.fn();
			render(
				<AnalyticsListener channel={ANALYTICS_CHANNEL} onEvent={onEvent}>
					<LinkUrl href={'https://some.url'} checkSafety={true}>
						https://otherUrl.url
					</LinkUrl>
				</AnalyticsListener>,
			);
			const linkUrlView = screen.getByRole('link');
			fireEvent.click(linkUrlView);
			return { onEvent };
		};

		it('should warning message with correct text', () => {
			setup();
			const body = screen.getByTestId('link-with-safety-warning--body');
			expect(body).toHaveTextContent(
				'The link https://otherUrl.url is taking you to a different site, https://some.url',
			);
		});

		it('should proceed to original url in new tab when continue is pressed', () => {
			setup();

			const continueButton = screen.getByRole('button', { name: 'Continue' });
			fireEvent.click(continueButton);

			expect(window.open).toHaveBeenCalledWith('https://some.url', '_blank', 'noopener noreferrer');
		});

		it('should close modal dialog when pressed continue', async () => {
			setup();

			const continueButton = screen.getByRole('button', { name: 'Continue' });
			act(() => {
				fireEvent.click(continueButton);
			});

			await waitFor(() => {
				expect(screen.queryByTestId('link-with-safety-warning')).not.toBeInTheDocument();
			});
		});

		it('should fire analytics event when continue button is clicked', () => {
			const { onEvent } = setup();

			const continueButton = screen.getByRole('button', { name: 'Continue' });
			fireEvent.click(continueButton);

			expect(onEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					hasFired: true,
					payload: expect.objectContaining({
						action: 'clicked',
						actionSubject: 'button',
						actionSubjectId: 'linkSafetyWarningModalContinue',
						eventType: 'ui',
						screen: 'linkSafetyWarningModal',
					}),
					context: expect.arrayContaining([
						{
							componentName: 'linkUrl',
							packageName: expect.any(String),
							packageVersion: expect.any(String),
						},
					]),
				}),
				ANALYTICS_CHANNEL,
			);
		});
	});

	it('should fire analytics event when link safety warning message is shown', () => {
		const onEvent = jest.fn();

		render(
			<AnalyticsListener channel={ANALYTICS_CHANNEL} onEvent={onEvent}>
				<LinkUrl href="https://some.url" checkSafety={true}>
					https://another.url
				</LinkUrl>
			</AnalyticsListener>,
		);

		const LinkUrlView = screen.getByTestId(LinkUrlTestId);
		fireEvent.click(LinkUrlView);

		expect(onEvent).toHaveBeenCalledWith(
			expect.objectContaining({
				hasFired: true,
				payload: expect.objectContaining({
					action: 'viewed',
					actionSubject: 'linkSafetyWarningModal',
					eventType: 'screen',
					name: 'linkSafetyWarningModal',
				}),
				context: expect.arrayContaining([
					{
						componentName: 'linkUrl',
						packageName: expect.any(String),
						packageVersion: expect.any(String),
					},
				]),
			}),
			ANALYTICS_CHANNEL,
		);
	});

	describe('link clicked', () => {
		const setup = (props?: ComponentProps<typeof LinkUrl>, text?: string) => {
			const user = userEvent.setup();
			const onEvent = jest.fn();

			const { getByTestId, getByRole } = render(
				<AnalyticsListener channel={ANALYTICS_CHANNEL} onEvent={onEvent}>
					<LinkUrl href="https://some.url" checkSafety={true} {...props}>
						{text ?? 'https://another.url'}
					</LinkUrl>
				</AnalyticsListener>,
			);

			const component = screen.getByRole('link');

			return {
				user,
				onEvent,
				getByRole,
				getByTestId,
				component,
			};
		};

		it('should fire `link clicked` event when left clicked', async () => {
			const { component, onEvent, user } = setup();

			await user.click(component);

			expect(onEvent).toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'clicked',
					actionSubject: 'link',
					eventType: 'ui',
					attributes: {
						clickType: 'left',
						clickOutcome: 'clickThrough',
						defaultPrevented: true,
						keysHeld: [],
					},
				},
				context: [
					{
						componentName: 'linkUrl',
					},
					{
						attributes: {
							display: 'url',
						},
					},
				],
			});
		});

		it('should not call `onClick` if checkSafety is true and link is unsafe', async () => {
			const onClick = jest.fn();
			const { component, user } = setup({ onClick });

			await user.click(component);

			expect(onClick).not.toHaveBeenCalled();
		});

		it('shoud call `onClick` if checkSafety is true and link is safe', async () => {
			const onClick = jest.fn();
			const { component, user } = setup({ onClick }, '#safe');

			await user.click(component);

			expect(onClick).toHaveBeenCalled();
		});

		it('should call `onClick` and fire `link clicked` event when link text cannot be normalized', async () => {
			const onClick = jest.fn();

			const { user, onEvent } = setup(
				{ onClick, checkSafety: true, href: 'https://some.url' },
				'some random text',
			);

			const component = screen.getByRole('link');
			await user.click(component);

			expect(onClick).toHaveBeenCalled();

			expect(onEvent).toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'clicked',
					actionSubject: 'link',
					eventType: 'ui',
					attributes: {
						clickType: 'left',
						clickOutcome: 'clickThrough',
						defaultPrevented: false,
						keysHeld: [],
					},
				},
				context: [
					{
						componentName: 'linkUrl',
					},
					{
						attributes: {
							display: 'url',
						},
					},
				],
			});
		});

		it('should call `onClick` and fire `link clicked` event when text and href are the same', async () => {
			const onClick = jest.fn();
			const { component, onEvent, user } = setup({
				onClick,
				href: 'https://another.url',
			});

			await user.click(component);

			expect(onClick).toHaveBeenCalled();

			expect(onEvent).toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'clicked',
					actionSubject: 'link',
					eventType: 'ui',
					attributes: {
						clickType: 'left',
						clickOutcome: 'clickThrough',
						defaultPrevented: false,
						keysHeld: [],
					},
				},
				context: [
					{
						componentName: 'linkUrl',
					},
					{
						attributes: {
							display: 'url',
						},
					},
				],
			});
		});

		it('should call `onClick` and fire `link clicked` event when link is an anchor', async () => {
			const onClick = jest.fn();
			const user = userEvent.setup();
			const { onEvent } = setup({ href: '#anchor', onClick }, 'https://some.url/#anchor');

			const component = screen.getByRole('link');
			await user.click(component);

			expect(onClick).toHaveBeenCalled();
			expect(onEvent).toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'clicked',
					actionSubject: 'link',
					eventType: 'ui',
					attributes: {
						clickType: 'left',
						clickOutcome: 'clickThrough',
						defaultPrevented: false,
						keysHeld: [],
					},
				},
				context: [
					{
						componentName: 'linkUrl',
					},
					{
						attributes: {
							display: 'url',
						},
					},
				],
			});
		});

		it('should call `onClick` and fire `link clicked` event when check link safety is off', async () => {
			const onClick = jest.fn();
			const { component, onEvent, user } = setup({
				onClick,
				checkSafety: false,
			});

			await user.click(component);

			expect(onClick).toHaveBeenCalled();

			expect(onEvent).toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'clicked',
					actionSubject: 'link',
					eventType: 'ui',
					attributes: {
						clickType: 'left',
						clickOutcome: 'clickThrough',
						defaultPrevented: false,
						keysHeld: [],
					},
				},
				context: [
					{
						componentName: 'linkUrl',
					},
					{
						attributes: {
							display: 'url',
						},
					},
				],
			});
		});

		it('should fire `link clicked` event when right clicked', async () => {
			const { component, onEvent, user } = setup();

			await user.pointer({ target: component, keys: '[MouseRight]' });

			expect(onEvent).toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'clicked',
					actionSubject: 'link',
					eventType: 'ui',
					attributes: {
						clickType: 'right',
						clickOutcome: 'contextMenu',
						keysHeld: [],
					},
				},
				context: [
					{
						componentName: 'linkUrl',
					},
					{
						attributes: {
							display: 'url',
						},
					},
				],
			});
		});

		it('should call `onMouseDown` if provided and still fire `link clicked` event', async () => {
			const onMouseDown = jest.fn();
			const { component, onEvent, user } = setup({ onMouseDown });

			await user.pointer({ target: component, keys: '[MouseRight]' });

			expect(onMouseDown).toHaveBeenCalledTimes(1);
			expect(onMouseDown).toHaveBeenCalledWith(expect.anything());

			expect(onEvent).toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'clicked',
					actionSubject: 'link',
					eventType: 'ui',
					attributes: {
						clickType: 'right',
						clickOutcome: 'contextMenu',
						keysHeld: [],
					},
				},
				context: [
					{
						componentName: 'linkUrl',
					},
					{
						attributes: {
							display: 'url',
						},
					},
				],
			});
		});

		it('should fire `link clicked` event when focused and enter key is pressed', async () => {
			const { onEvent, user } = setup();

			await user.keyboard('{Tab}{Enter}');

			expect(onEvent).toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'clicked',
					actionSubject: 'link',
					eventType: 'ui',
					attributes: {
						clickType: 'keyboard',
						clickOutcome: 'clickThrough',
						defaultPrevented: true,
						keysHeld: [],
					},
				},
				context: [
					{
						componentName: 'linkUrl',
					},
					{
						attributes: {
							display: 'url',
						},
					},
				],
			});
		});

		it('should not throw when link cannot be converted to url', async () => {
			const href = 'slack://';
			const onClick = jest.fn();
			const user = userEvent.setup();

			setup({ href, onClick }, href);

			const component = screen.getByRole('link');

			await expect(user.click(component)).resolves.not.toThrow();
			expect(onClick).toHaveBeenCalled();
		});
	});
});
