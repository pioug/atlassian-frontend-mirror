/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { IntlShape } from 'react-intl-next';

import { pixelEntryMessages as messages } from '@atlaskit/editor-common/media';
import {
	calcMinWidth,
	DEFAULT_IMAGE_HEIGHT,
	DEFAULT_IMAGE_WIDTH,
} from '@atlaskit/editor-common/media-single';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { HoverDecorationHandler } from '@atlaskit/editor-plugin-decorations';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { type ContentNodeWithPos, hasParentNode } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorDefaultLayoutWidth,
	akEditorFullWidthLayoutWidth,
} from '@atlaskit/editor-shared-styles';
import { Text } from '@atlaskit/primitives';

import { MediaNextEditorPluginType } from '../../../mediaPluginType';
import { MediaPluginState } from '../../../types';
import { updateMediaSingleWidthTr } from '../../../ui/toolbar/commands';
import { getPixelWidthOfElement, calcNewLayout } from '../../../ui/toolbar/utils';
import { isVideo } from '../../utils/media-single';
import { closePixelEditorAndSave } from '../commands';

import { PixelEntryComponent } from './pixel-entry';
import { pixelSizingFullWidthLabelStyles } from './styles';
import { PixelEntryValidation } from './types';

export type Props = {
	editorView: EditorView;
	selectedMediaSingleNode: ContentNodeWithPos;
	pluginInjectionApi?: ExtractInjectionAPI<MediaNextEditorPluginType>;
	intl: IntlShape;
	pluginState: MediaPluginState;
	hoverDecoration: HoverDecorationHandler | undefined;
	isEditorFullWidthEnabled?: boolean;
};

export const PixelEntry = ({
	editorView,
	selectedMediaSingleNode,
	pluginInjectionApi,
	intl,
	pluginState,
	hoverDecoration,
	isEditorFullWidthEnabled,
}: Props) => {
	const { state, dispatch } = editorView;
	const { mediaSingle } = state.schema.nodes;

	const contentWidth =
		pluginInjectionApi?.width.sharedState.currentState()?.lineLength || akEditorDefaultLayoutWidth;
	const { width: mediaSingleWidth, widthType, layout } = selectedMediaSingleNode.node.attrs;

	// hasParentNode will return falsey value if selection depth === 0
	const isNested = hasParentNode((n) => n.type !== state.schema.nodes.doc)(state.selection);

	const updateNodeWithTr = useCallback(
		(width: number, validation: PixelEntryValidation) => {
			const newLayout = calcNewLayout(
				width,
				layout,
				contentWidth,
				isEditorFullWidthEnabled,
				isNested,
			);

			return updateMediaSingleWidthTr(
				pluginInjectionApi?.analytics?.actions,
				state,
				width,
				validation,
				'floatingToolBar',
				newLayout,
			);
		},
		[layout, contentWidth, isEditorFullWidthEnabled, isNested, state, pluginInjectionApi],
	);

	const selectedMediaNode = selectedMediaSingleNode.node.content.firstChild;
	if (!selectedMediaNode) {
		return null;
	}

	const { width: mediaWidth, height: mediaHeight } = selectedMediaNode.attrs;

	const maxWidthForNestedNode =
		pluginInjectionApi?.media?.sharedState.currentState()?.currentMaxWidth;

	const maxWidth = maxWidthForNestedNode || akEditorFullWidthLayoutWidth;

	const isVideoFile = isVideo(selectedMediaNode.attrs.__fileMimeType);

	const minWidth = calcMinWidth(isVideoFile, maxWidthForNestedNode || contentWidth);

	const hasPixelType = widthType === 'pixel';

	const pixelWidthFromElement = getPixelWidthOfElement(
		editorView,
		selectedMediaSingleNode.pos + 1, // get pos of media node
		mediaWidth || DEFAULT_IMAGE_WIDTH,
	);

	const pixelWidth = hasPixelType ? mediaSingleWidth : pixelWidthFromElement;

	return (
		<PixelEntryComponent
			intl={intl}
			width={pluginState.isResizing ? pluginState.resizingWidth : pixelWidth}
			showMigration={!pluginState.isResizing && !hasPixelType}
			mediaWidth={mediaWidth || DEFAULT_IMAGE_WIDTH}
			mediaHeight={mediaHeight || DEFAULT_IMAGE_HEIGHT}
			minWidth={minWidth}
			maxWidth={maxWidth}
			onChange={(valid: boolean) => {
				if (valid) {
					hoverDecoration?.(mediaSingle, true, 'warning')(editorView.state, dispatch, editorView);
				} else {
					hoverDecoration?.(mediaSingle, false)(editorView.state, dispatch, editorView);
				}
			}}
			onSubmit={({ width, validation }) => {
				const tr = updateNodeWithTr(width, validation);
				if (tr) {
					dispatch(tr);
				}
			}}
			onMigrate={() => {
				const tr = state.tr.setNodeMarkup(selectedMediaSingleNode.pos, undefined, {
					...selectedMediaSingleNode.node.attrs,
					width: pixelWidthFromElement,
					widthType: 'pixel',
				});
				tr.setMeta('scrollIntoView', false);
				tr.setSelection(NodeSelection.create(tr.doc, selectedMediaSingleNode.pos));
				dispatch(tr);
			}}
			onCloseAndSave={({ width, validation }) => {
				const tr = updateNodeWithTr(width, validation);

				if (tr) {
					return closePixelEditorAndSave(() => tr)(state, dispatch);
				}
			}}
			isViewMode={pluginState.isResizing}
		/>
	);
};

export const FullWidthDisplay = ({ intl: { formatMessage } }: { intl: IntlShape }) => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		<div css={pixelSizingFullWidthLabelStyles}>
			<Text>{formatMessage(messages.fullWidthLabel)}</Text>
		</div>
	);
};
