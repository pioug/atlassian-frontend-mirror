import { createElement } from 'react';

import { type IntlShape } from 'react-intl-next';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid';

import { getDocument } from '@atlaskit/browser-apis';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type EditorState } from '@atlaskit/editor-prosemirror/state';
import { Decoration, type DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { RemixButton } from '../ui/remix-button';

const TYPE_REMIX_BUTTON = 'REMIX_BUTTON';

export const findRemixButtonDecoration = (
	decorations: DecorationSet,
	from?: number,
	to?: number,
) => {
	return decorations.find(from, to, (spec) => spec.type === TYPE_REMIX_BUTTON);
};

type RemixButtonDecorationParams = {
	anchorName: string;
	api: ExtractInjectionAPI<BlockControlsPlugin>;
	editorState: EditorState;
	formatMessage: IntlShape['formatMessage'];
	nodeType: string;
	nodeViewPortalProviderAPI: PortalProviderAPI;
	rootAnchorName?: string;
	rootNodeType?: string;
	rootPos: number;
};

/** Right-edge Remix button: same gutter as left controls (side: -4) but positioned at block right edge. */
export const remixButtonDecoration = ({
	api,
	formatMessage,
	rootPos,
	anchorName,
	nodeType,
	nodeViewPortalProviderAPI,
	rootAnchorName,
	rootNodeType,
}: RemixButtonDecorationParams) => {
	// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
	const key = uuid();
	const widgetSpec = {
		side: -4,
		type: TYPE_REMIX_BUTTON,
		destroy: (_: Node) => {
			if (fg('platform_editor_fix_widget_destroy')) {
				nodeViewPortalProviderAPI.remove(key);
			}
		},
	};

	return Decoration.widget(
		rootPos,
		(view, getPos) => {
			const doc = getDocument();
			if (!doc) {
				throw new Error('Document not available');
			}
			const element = doc.createElement('span');
			element.style.display = 'block';
			element.contentEditable = 'false';
			element.setAttribute('data-blocks-remix-button-container', 'true');
			element.setAttribute('data-testid', 'block-ctrl-remix-button-container');

			nodeViewPortalProviderAPI.render(
				() =>
					createElement(RemixButton, {
						api,
						getPos,
						formatMessage,
						view,
						nodeType,
						anchorName,
						rootAnchorName,
						rootNodeType: rootNodeType ?? nodeType,
					}),
				element,
				key,
				undefined,
				true,
			);

			return element;
		},
		widgetSpec,
	);
};
