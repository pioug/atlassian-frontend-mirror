import React from 'react';

import type { IntlShape } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { addAltText, ToolTipContent } from '@atlaskit/editor-common/keymaps';
import { altTextMessages as messages } from '@atlaskit/editor-common/media';
import { MediaSharedClassNames as ClassNames } from '@atlaskit/editor-common/styles';
import type {
	Command,
	FloatingToolbarButton,
	FloatingToolbarConfig,
	FloatingToolbarCustom,
	FloatingToolbarOverflowDropdownOptions,
} from '@atlaskit/editor-common/types';
import { RECENT_SEARCH_WIDTH_IN_PX as CONTAINER_WIDTH_IN_PX } from '@atlaskit/editor-common/ui';
import type { ForceFocusSelector } from '@atlaskit/editor-plugin-floating-toolbar';
import { NodeType } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, type EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import TextIcon from '@atlaskit/icon/core/text';

import { openMediaAltTextMenu } from '../../pm-plugins/alt-text/commands';
import AltTextEdit from '../../pm-plugins/alt-text/ui/AltTextEdit';
import { isImage } from '../../pm-plugins/utils/is-type';
import { getMediaSingleOrInlineNodeFromSelection } from '../../pm-plugins/utils/media-common';
import type { MediaToolbarBaseConfig } from '../../types';

import { getNodeType } from './commands';

const testId = 'alt-text-edit-button';

export const altTextButton = (
	intl: IntlShape,
	state: EditorState,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): FloatingToolbarButton<Command> => {
	const mediaNode = getMediaSingleOrInlineNodeFromSelection(state);
	const message = mediaNode && mediaNode.attrs.alt ? messages.editAltText : messages.altText;
	const title = intl.formatMessage(message);
	return {
		title,
		id: 'editor.media.altText',
		type: 'button',
		onClick: openMediaAltTextMenu(editorAnalyticsAPI),
		showTitle: true,
		testId,
		tooltipContent: <ToolTipContent description={title} keymap={addAltText} />,
	};
};

const altTextEditComponent = (options?: AltTextToolbarOptions): FloatingToolbarCustom<Command> => {
	return {
		type: 'custom',
		fallback: [],
		disableArrowNavigation: true,
		render: (view?: EditorView, idx?: number) => {
			if (!view) {
				return null;
			}
			const state = view.state;
			const mediaNode = getMediaSingleOrInlineNodeFromSelection(state);

			if (!mediaNode) {
				return null;
			}
			/** Focus should move to the 'Alt text' button when the toolbar closes
			 * and not close the floating toolbar.
			 */
			const handleEsc = () => {
				const {
					state: { tr },
					dispatch,
				} = view;
				const newTr = options?.forceFocusSelector?.(`[data-testid="${testId}"]`)(tr);

				if (newTr) {
					dispatch(newTr);
				}
			};

			const type = getNodeType(state);

			return (
				<AltTextEdit
					view={view}
					key={idx}
					nodeType={type}
					mediaType={mediaNode.attrs.type}
					value={mediaNode.attrs.alt}
					altTextValidator={options && options.altTextValidator}
					onEscape={handleEsc}
				/>
			);
		},
	};
};

interface AltTextToolbarOptions {
	altTextValidator?: (value: string) => string[];
	forceFocusSelector?: ForceFocusSelector;
}

export const getAltTextToolbar = (
	toolbarBaseConfig: MediaToolbarBaseConfig,
	options?: AltTextToolbarOptions,
): FloatingToolbarConfig => {
	return {
		...toolbarBaseConfig,
		width: CONTAINER_WIDTH_IN_PX,
		className: ClassNames.FLOATING_TOOLBAR_COMPONENT,
		items: [altTextEditComponent(options)],
	};
};

export const getAltTextDropdownOption = (
	state: EditorState,
	formatMessage: IntlShape['formatMessage'],
	allowAltTextOnImages?: boolean,
	selectedNodeType?: NodeType,
	editorAnalyticsAPI?: EditorAnalyticsAPI,
): FloatingToolbarOverflowDropdownOptions<Command> => {
	const { mediaSingle, mediaInline } = state.schema.nodes;
	const mediaType = state.selection instanceof NodeSelection && state.selection.node.attrs.type;

	if (
		allowAltTextOnImages &&
		(selectedNodeType === mediaSingle || (selectedNodeType === mediaInline && isImage(mediaType)))
	) {
		return [
			{
				title: formatMessage(messages.addAltText),
				onClick: openMediaAltTextMenu(editorAnalyticsAPI),
				icon: <TextIcon label="" />,
				testId: 'media-alt-text-dropdown-option',
			},
		];
	}

	return [];
};
