import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { ErrorReporter } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';

import type { CustomMediaPicker, getPosHandler, MediaState } from './types';

export type MediaPluginOptions = {
	providerFactory: ProviderFactory;
	nodeViews: {
		[name: string]: (node: PMNode, view: EditorView, getPos: getPosHandler) => NodeView;
	};
	errorReporter?: ErrorReporter;
	uploadErrorHandler?: (state: MediaState) => void;
	waitForMediaUpload?: boolean;
	customDropzoneContainer?: HTMLElement;
	customMediaPicker?: CustomMediaPicker;
	allowResizing: boolean;
};
