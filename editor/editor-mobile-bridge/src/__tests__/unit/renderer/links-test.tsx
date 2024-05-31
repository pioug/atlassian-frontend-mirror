import type { DocNode } from '@atlaskit/adf-schema';
import type { ResolveResponse } from '@atlaskit/smart-card';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import type { IntlShape } from 'react-intl-next';
import {
	createEmojiProvider,
	createMediaProvider,
	createMentionProvider,
} from '../../../providers';
import { createCardClient, MobileSmartCardClient } from '../../../providers/cardProvider';
import { MobileRenderer } from '../../../renderer/mobile-renderer-element';
import RendererBridgeImplementation from '../../../renderer/native-to-web/implementation';
import { FetchProxy } from '../../../utils/fetch-proxy';

const mockIntersectionObserver = () => {
	class MockIntersectionObserver implements IntersectionObserver {
		readonly root!: Element | null;
		readonly rootMargin!: string;
		readonly thresholds!: ReadonlyArray<number>;

		constructor(public callback: IntersectionObserverCallback) {}

		observe(_element: HTMLElement) {
			const entries = [{ isIntersecting: true }] as IntersectionObserverEntry[];
			this.callback(entries, this);
		}
		disconnect = jest.fn();
		takeRecords = jest.fn();
		unobserve = jest.fn();
	}

	Object.defineProperty(window, 'IntersectionObserver', {
		writable: true,
		configurable: true,
		value: MockIntersectionObserver,
	});
};

class MockedMobileSmartCardClient extends MobileSmartCardClient {
	async fetchData(url: string) {
		return Promise.resolve({
			meta: {
				visibility: 'restricted',
				access: 'granted',
				auth: [
					{
						displayName: 'github.com',
						key: 'default',
						url: 'https://id.atlassian.com/outboundAuth/start?containerId=12e35df3-21ea-4225-bd53-7a6be9760507&serviceKey=default',
					},
				],
				definitionId: 'c16ac6b8-6717-4d75-87ef-ff187a1aaaab',
			},
			data: {
				'@context': {
					'@vocab': 'https://www.w3.org/ns/activitystreams#',
					atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
					schema: 'http://schema.org/',
				},
				'@type': 'Object',
				url: 'https://github.com/ProseMirror/prosemirror-view',
				'atlassian:updatedBy': {
					'@type': 'Person',
					image: 'https://avatars.githubusercontent.com/u/20928690?',
					name: 'tuser',
				},
				generator: {
					'@type': 'Application',
					icon: {
						'@type': 'Image',
						url: 'https://github.githubassets.com/favicon.ico',
					},
					name: 'Github Object Provider',
				},
			},
		} as ResolveResponse);
	}
}

const mockCardClient = new MockedMobileSmartCardClient();

const linkADF: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: "I'm a normal link",
					marks: [
						{
							type: 'link' as const,
							attrs: {
								href: 'http://prosemirror.net',
							},
						},
					],
				},
			],
		},
	],
};

const smartLinkADF: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'inlineCard',
					attrs: {
						url: 'https://github.com/ProseMirror/prosemirror-view',
					},
				},
			],
		},
	],
};

/**
 * This test suite ensures that clicking links inside the mobile renderer
 * correctly prevent the default browser behaviour.
 *
 * These tests mount the `<MobileRenderer />` component in order to
 * test the link click handlers which get defined in that file, and
 * are passed into the instance via the `eventHandler` prop.
 *
 * Unfortunately, the below warning is logged by `react-dom` because the
 * rendered smart card component uses async state updates.
 * We don't have the opportunity to wrap them in `act()` in this case.
 *
 * `Warning: An update to CardWithUrlContent inside a test was not wrapped in act(...).`
 */
describe('renderer bridge: links', () => {
	const intlMock = {
		formatMessage: (messageDescriptor: any) =>
			messageDescriptor && messageDescriptor.defaultMessage,
	} as unknown as IntlShape;
	const rendererBridge = new RendererBridgeImplementation();

	beforeAll(() => {
		mockIntersectionObserver();
	});

	afterEach(jest.clearAllMocks);

	it('should prevent WebView redirection when clicking regular links', async () => {
		render(
			<MobileRenderer
				cardClient={createCardClient()}
				emojiProvider={createEmojiProvider(new FetchProxy())}
				mediaProvider={createMediaProvider()}
				mentionProvider={createMentionProvider()}
				document={linkADF}
				intl={intlMock}
				rendererBridge={rendererBridge}
			/>,
		);

		const normalLink = screen.getByRole('link', { name: "I'm a normal link" });

		const mouseEvent = new MouseEvent('click', {
			bubbles: true,
			cancelable: true,
		});
		const preventDefaultSpy = jest.spyOn(mouseEvent, 'preventDefault');

		fireEvent(normalLink, mouseEvent);

		await waitFor(() => expect(preventDefaultSpy).toHaveBeenCalledTimes(1));
		expect(mouseEvent.defaultPrevented).toBe(true);
	});

	it('should prevent WebView redirection when clicking smart links', async () => {
		render(
			<MobileRenderer
				document={smartLinkADF}
				cardClient={mockCardClient}
				emojiProvider={createEmojiProvider(new FetchProxy())}
				mediaProvider={createMediaProvider()}
				mentionProvider={createMentionProvider()}
				intl={intlMock}
				rendererBridge={rendererBridge}
			/>,
		);

		const smartLink = await screen.findByRole('button', { name: '' });

		const mouseEvent = new MouseEvent('click', {
			bubbles: true,
			cancelable: true,
		});
		const preventDefaultSpy = jest.spyOn(mouseEvent, 'preventDefault');

		fireEvent(smartLink, mouseEvent);

		await waitFor(() => expect(preventDefaultSpy).toHaveBeenCalled()); // Called twice?
		expect(mouseEvent.defaultPrevented).toBe(true);
	});
});
