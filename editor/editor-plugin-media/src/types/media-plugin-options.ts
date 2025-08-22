import type { NodeViewConstructor } from '@atlaskit/editor-common/lazy-node-view';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { ErrorReporter } from '@atlaskit/editor-common/utils';

import type { CustomMediaPicker, MediaState } from './index';

export type MediaPluginOptions = {
	allowResizing: boolean;
	customDropzoneContainer?: HTMLElement;
	customMediaPicker?: CustomMediaPicker;
	errorReporter?: ErrorReporter;
	nodeViews: {
		[name: string]: NodeViewConstructor;
	};
	providerFactory: ProviderFactory;
	uploadErrorHandler?: (state: MediaState) => void;
	waitForMediaUpload?: boolean;
};
