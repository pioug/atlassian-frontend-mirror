import { mount, type ReactWrapper } from 'enzyme';
import React from 'react';
import type { DocNode } from '@atlaskit/adf-schema';
import { MobileRenderer } from '../../../renderer/mobile-renderer-element';
import WebBridgeImpl from '../../../renderer/native-to-web/implementation';
import { createIntl, RawIntlProvider } from 'react-intl-next';
import {
	createCardClient,
	createEmojiProvider,
	createMediaProvider,
	createMentionProvider,
} from '../../../providers';
import { FetchProxy } from '../../../utils/fetch-proxy';
import RendererBridgeImplementation from '../../../renderer/native-to-web/implementation';

const initialDocument: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'This is the mobile renderer',
				},
			],
		},
	],
};

// @ts-ignore
const invalidDocument = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'mention',
			content: [
				{
					type: 'paragraph',
					text: 'This is invalid adf',
				},
			],
		},
	],
} as DocNode;

describe('general', () => {
	const bridge: any = new WebBridgeImpl();

	it('should return valid bridge version', () => {
		expect(bridge.currentVersion()).toEqual(process.env._PACKAGE_VERSION_);
	});
});

describe('renderer bridge', () => {
	let onContentRendered: jest.Mock;
	let mobileRenderer: ReactWrapper;
	const rendererBridge = new RendererBridgeImplementation();
	const intl = createIntl({ locale: 'en' });

	const initRenderer = (adf: DocNode): ReactWrapper => {
		return mount(
			<RawIntlProvider value={intl}>
				<MobileRenderer
					document={adf}
					cardClient={createCardClient()}
					emojiProvider={createEmojiProvider(new FetchProxy())}
					mediaProvider={createMediaProvider()}
					mentionProvider={createMentionProvider()}
					intl={intl}
					rendererBridge={rendererBridge}
				/>
			</RawIntlProvider>,
		);
	};

	beforeEach(() => {
		// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
		//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
		jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
			cb(1);
		});
		onContentRendered = jest.fn();
		window.renderBridge = {
			onContentRendered,
			onRenderedContentHeightChanged() {},
		};
	});

	afterEach(() => {
		mobileRenderer.unmount();
	});

	it('should call renderBridge.onContentRendered() once rendered', () => {
		mobileRenderer = initRenderer(initialDocument);
		expect(onContentRendered).toHaveBeenCalled();
	});

	it('should still call renderBridge.onContentRendered() when given invalid adf', () => {
		mobileRenderer = initRenderer(invalidDocument);
		expect(onContentRendered).toHaveBeenCalled();
	});
});
