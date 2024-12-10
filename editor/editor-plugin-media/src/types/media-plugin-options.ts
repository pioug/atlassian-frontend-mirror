import type { NodeViewConstructor } from '@atlaskit/editor-common/lazy-node-view';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { ErrorReporter } from '@atlaskit/editor-common/utils';

import type { CustomMediaPicker, MediaState } from './index';

export type MediaPluginOptions = {
	providerFactory: ProviderFactory;
	nodeViews: {
		[name: string]: NodeViewConstructor;
	};
	errorReporter?: ErrorReporter;
	uploadErrorHandler?: (state: MediaState) => void;
	waitForMediaUpload?: boolean;
	customDropzoneContainer?: HTMLElement;
	customMediaPicker?: CustomMediaPicker;
	allowResizing: boolean;
};
