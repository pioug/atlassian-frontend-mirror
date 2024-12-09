import type { GetClient, LoomPluginOptions, VideoMeta } from '@atlaskit/editor-plugin-loom';

type LoomProviderConfig = {
	publicAppId?: string;
};

const createLoomClient = async (loomProviderConfig: LoomProviderConfig): GetClient => {
	const { publicAppId } = loomProviderConfig;

	// eslint-disable-next-line import/dynamic-import-chunkname
	const { isSupported, setup } = await import(
		/* webpackChunkName: "loadable-loomhq-record-sdk" */ '@loomhq/record-sdk'
	);

	const { supported } = await isSupported();

	if (!supported) {
		return {
			status: 'error',
			message: 'is-supported-failure',
		};
	}

	// Public App ID overrides token fetch
	if (publicAppId) {
		const sdk = await setup({
			publicAppId,
		});

		// SDK Initialisation Status
		const status = sdk.status();

		if (!status.success) {
			return {
				status: 'error',
				message: 'failed-to-initialise',
			};
		}

		return {
			status: 'loaded',
			client: {
				attachToButton: ({ button, onInsert }) => {
					const sdkConfiguredButton = sdk.configureButton({
						element: button,
					});
					sdkConfiguredButton.addListener('insert-click', (video: VideoMeta) => {
						onInsert(video);
					});
				},
			},
		};
	}

	return {
		status: 'error',
		message: 'api-key-not-provided',
	};
};

export const getLoomProvider = (loomProviderConfig: LoomProviderConfig): LoomPluginOptions => {
	const loomProvider: LoomPluginOptions = {
		loomProvider: {
			getClient: () => createLoomClient(loomProviderConfig),
		},
	};

	return loomProvider;
};
