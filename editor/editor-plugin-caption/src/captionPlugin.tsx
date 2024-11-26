import { caption } from '@atlaskit/adf-schema';

import type { CaptionPlugin } from './captionPluginType';
import { captionKeymap } from './pm-plugins/keymap';
import { default as createCaptionPlugin } from './pm-plugins/main';

const captionPlugin: CaptionPlugin = ({ api }) => {
	return {
		name: 'caption',

		nodes() {
			return [{ name: 'caption', node: caption }];
		},

		pmPlugins() {
			return [
				{
					name: 'caption',
					plugin: ({ portalProviderAPI, providerFactory, eventDispatcher, dispatch }) =>
						createCaptionPlugin(portalProviderAPI, eventDispatcher, providerFactory, dispatch, api),
				},
				{
					name: 'captionKeymap',
					plugin: captionKeymap,
				},
			];
		},
	};
};

export default captionPlugin;
