import React from 'react';
import MobileRendererWithIntl, { MobileRenderer } from '../../mobile-renderer-element';
import {
	createCardClient,
	createEmojiProvider,
	createMediaProvider,
	createMentionProvider,
} from '../../../providers';
import { FetchProxy } from '../../../utils/fetch-proxy';
import type { sendToBridge as originalSendToBridge } from '../../../bridge-utils';
import type { DocNode } from '@atlaskit/adf-schema';
import { doc, p, text, date } from '@atlaskit/adf-utils/builders';
import { render as renderTestingLib, cleanup } from '@testing-library/react';
import { mount } from 'enzyme';
import * as rendererHook from '../../hooks/use-set-renderer-content';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { IntlShape } from 'react-intl-next';
import * as useTranslations from '../../../i18n/use-translations';
import RendererBridgeImplementation from '../../native-to-web/implementation';

jest.mock('../../../bridge-utils');
describe('renderer bridge', () => {
	const createPromiseMock = jest.fn();
	let rendererBridge: RendererBridgeImplementation;
	let fetchProxy: FetchProxy;
	let intlMock: any;

	beforeEach(() => {
		fetchProxy = new FetchProxy();
		fetchProxy.enable();
		createPromiseMock.mockReset();
		rendererBridge = new RendererBridgeImplementation();
		intlMock = {
			formatMessage: (messageDescriptor: any) =>
				messageDescriptor && messageDescriptor.defaultMessage,
		} as unknown as IntlShape;
	});

	afterEach(() => {
		fetchProxy.disable();
		cleanup();
	});

	describe('Intialize renderer', () => {
		afterEach(() => {
			jest.resetAllMocks();
			jest.restoreAllMocks();
		});
		let useRendererContentSpy: any;
		beforeEach(() => {
			useRendererContentSpy = jest.spyOn(rendererHook, 'useRendererContent');
		});

		it('should call useRendererContent when Mobile renderer is loaded', () => {
			useRendererContentSpy.mockImplementation(() => {
				return {
					type: 'doc',
					version: 1,
					content: [],
				} as JSONDocNode;
			});
			const wrapper = mount(
				<MobileRenderer
					// @ts-ignore
					document={'' as DocNode}
					cardClient={createCardClient()}
					emojiProvider={createEmojiProvider(fetchProxy)}
					mediaProvider={createMediaProvider()}
					mentionProvider={createMentionProvider()}
					intl={intlMock}
					rendererBridge={rendererBridge}
				/>,
			);
			expect(useRendererContentSpy).toHaveBeenCalledTimes(1);
			wrapper.unmount();
		});

		it('should have localise renderer', async () => {
			const messages = {};
			jest.spyOn(useTranslations, 'useTranslations').mockReturnValue({ locale: 'pl', messages });

			const initialDoc = doc(p(date({ timestamp: '1603756800000' }))) as DocNode;
			const result = mount(
				<MobileRendererWithIntl
					document={initialDoc}
					cardClient={createCardClient()}
					emojiProvider={createEmojiProvider(fetchProxy)}
					mediaProvider={createMediaProvider()}
					mentionProvider={createMentionProvider()}
					locale="pl"
					rendererBridge={rendererBridge}
				/>,
			);
			const basicRendererIntlProp = result.find('BasicRenderer').prop('intl') as IntlShape;

			expect(basicRendererIntlProp.locale).toBe('pl');
			expect(basicRendererIntlProp.messages).toBe(messages);
			result.unmount();
		});
	});

	describe('Lifecycle', () => {
		let sendToBridge: jest.Mocked<typeof originalSendToBridge>;

		beforeEach(async () => {
			({ sendToBridge } = (await import('../../../bridge-utils')) as any as {
				sendToBridge: jest.Mocked<typeof originalSendToBridge>;
			});
		});

		afterEach(() => {
			jest.clearAllMocks();
		});

		it('should call rendererReady when the initial document has been renderer', async () => {
			const initialDoc = doc(p(text('foo'))) as DocNode;
			const result = renderTestingLib(
				<MobileRenderer
					document={initialDoc}
					cardClient={createCardClient()}
					emojiProvider={createEmojiProvider(fetchProxy)}
					mediaProvider={createMediaProvider()}
					mentionProvider={createMentionProvider()}
					intl={intlMock}
					rendererBridge={rendererBridge}
				/>,
			);

			await result.findByText('foo');
			expect(sendToBridge).toHaveBeenCalledWith('lifecycleBridge', 'rendererReady');
		});

		it('should call rendererDestroyed when the renderer is unmounted', async () => {
			const initialDoc = doc(p(text('foo')));
			const result = renderTestingLib(
				<MobileRenderer
					document={initialDoc as DocNode}
					cardClient={createCardClient()}
					emojiProvider={createEmojiProvider(fetchProxy)}
					mediaProvider={createMediaProvider()}
					mentionProvider={createMentionProvider()}
					intl={intlMock}
					rendererBridge={rendererBridge}
				/>,
			);

			await result.findByText('foo');
			result.unmount();

			expect(sendToBridge).toHaveBeenCalledWith('lifecycleBridge', 'rendererDestroyed');
		});
	});
});
