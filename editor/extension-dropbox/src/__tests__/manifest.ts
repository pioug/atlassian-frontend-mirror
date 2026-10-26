import { createRoot } from 'react-dom/client';
import { createIntl } from 'react-intl';

import { POPUP_MOUNTPOINT } from '../constants';
import getManifest from '../manifest';
import type { DropboxFile } from '../types';

jest.mock('react-dom/client', () => ({
	createRoot: jest.fn(),
}));

const asMock = (fn: Function): jest.Mock => fn as jest.Mock;
const mockCreateRoot = asMock(createRoot);

const fakeDropboxFile: DropboxFile = {
	link: 'https://atlaskit.atlassian.com/',
	isDir: false,
	linkType: 'preview',
	name: 'fake dropbox file.pdf',
	id: 'ASDFFDSA',
	icon: 'https://atlaskit.atlassian.com/',
};

const callAction = (appKey: string, canMountinIframe: boolean = false) =>
	(
		getManifest({ appKey, canMountinIframe }).modules.quickInsert![0].action as () => Promise<any>
	)();

describe('dropbox extension manifest', () => {
	it('localizes the preview attribution with the host formatter', () => {
		const intl = createIntl({
			locale: 'en',
			messages: { 'editor-extension-dropbox.attribution-name.ai-non-final': 'Localized Dropbox' },
		});
		const manifest = getManifest({ appKey: 'FAKE_KEY', canMountinIframe: false, intl });
		expect(manifest.preview?.attribution?.name).toBe('Localized Dropbox');
	});

	const mockRootRender = jest.fn();
	const mockRootUnmount = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		mockCreateRoot.mockReturnValue({
			render: mockRootRender,
			unmount: mockRootUnmount,
		});
	});

	afterEach(() => {
		// @ts-ignore
		delete window.Dropbox;
	});
	it('should return an inline card to the quickInsert action on dropbox file chooser success', async () => {
		window.Dropbox = {
			choose: ({ success }) => {
				success([fakeDropboxFile]);
			},
		};

		const inlineCard = await callAction('FAKE_KEY');

		expect(inlineCard).toEqual({
			type: 'inlineCard',
			attrs: {
				url: 'https://atlaskit.atlassian.com/',
			},
		});
	}, 2000);
	it('should not insert an inline card if choose fails, or is exited', async () => {
		window.Dropbox = {
			choose: ({ cancel }) => {
				cancel();
			},
		};
		await expect(callAction('FAKE_KEY')).rejects.toBeUndefined();
	});
	it('should add the mount point if canMountInIframe check returns true', async () => {
		window.Dropbox = {
			choose: ({ success }) => {
				success([fakeDropboxFile]);
			},
		};

		const inlineCard = await callAction('FAKE_KEY', true);

		const mountPoint = document.getElementById(POPUP_MOUNTPOINT);
		const tagName = mountPoint && mountPoint.tagName;

		expect(tagName).toEqual('DIV');

		expect(inlineCard).toEqual({
			type: 'inlineCard',
			attrs: {
				url: 'https://atlaskit.atlassian.com/',
			},
		});
	});

	it('should load modal if canMountInIframe check returns true', async () => {
		window.Dropbox = {
			choose: ({ success }) => {
				success([fakeDropboxFile]);
			},
		};

		const inlineCard = await callAction('FAKE_KEY', true);

		expect(mockCreateRoot).toHaveBeenCalledTimes(1);
		expect(mockRootRender).toHaveBeenCalledTimes(1);
		expect(mockRootUnmount).toHaveBeenCalledTimes(1);

		const [mountPoint] = mockCreateRoot.mock.calls[0];
		const [component] = mockRootRender.mock.calls[0];

		const id = mountPoint! && mountPoint!.id;
		const componentName = component && component.type && component.type.name;

		expect(componentName).toEqual('Modal');
		expect(id).toEqual(POPUP_MOUNTPOINT);

		expect(inlineCard).toEqual({
			type: 'inlineCard',
			attrs: {
				url: 'https://atlaskit.atlassian.com/',
			},
		});
	});
});
