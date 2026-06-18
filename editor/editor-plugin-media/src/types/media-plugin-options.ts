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
	/**
	 * Optional fallback fetcher to retrieve the media filename from another service.
	 * Workaround for #hot-301450 where media service is missing filenames for DC -> Cloud migrated media.
	 * Receives the file ID and should resolve to the filename string.
	 */
	fallbackMediaNameFetcher?: (id: string) => Promise<string>;
};
