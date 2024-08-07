/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import type { ExtractInjectionAPI, FeatureFlags } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { ToolbarListsIndentationPlugin } from '../plugin';
import type { IndentationButtonNode } from '../pm-plugins/indentation-buttons';

import { onItemActivated } from './onItemActivated';
import { Toolbar } from './Toolbar';
import { ToolbarDropdown } from './ToolbarDropdown';

export interface Props {
	editorView: EditorView;
	featureFlags: FeatureFlags;
	bulletListActive?: boolean;
	bulletListDisabled?: boolean;
	orderedListActive?: boolean;
	orderedListDisabled?: boolean;
	disabled?: boolean;
	isSmall?: boolean;
	isReducedSpacing?: boolean;
	popupsMountPoint?: HTMLElement;
	popupsBoundariesElement?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	showIndentationButtons?: boolean;
	indentDisabled?: boolean;
	outdentDisabled?: boolean;
	indentationStateNode?: IndentationButtonNode;
	pluginInjectionApi?: ExtractInjectionAPI<ToolbarListsIndentationPlugin> | undefined;
}

export default function ToolbarListsIndentation(props: Props) {
	const {
		disabled,
		isSmall,
		isReducedSpacing,
		bulletListActive,
		bulletListDisabled,
		orderedListActive,
		orderedListDisabled,
		showIndentationButtons,
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
		indentDisabled,
		outdentDisabled,
		indentationStateNode,
		featureFlags,
		pluginInjectionApi,
	} = props;

	if (isSmall) {
		return (
			<ToolbarDropdown
				editorView={props.editorView}
				isReducedSpacing={isReducedSpacing}
				popupsMountPoint={popupsMountPoint}
				popupsBoundariesElement={popupsBoundariesElement}
				popupsScrollableElement={popupsScrollableElement}
				bulletListActive={bulletListActive}
				bulletListDisabled={bulletListDisabled}
				showIndentationButtons={showIndentationButtons}
				orderedListActive={orderedListActive}
				orderedListDisabled={orderedListDisabled}
				indentDisabled={indentDisabled}
				outdentDisabled={outdentDisabled}
				disabled={disabled}
				onItemActivated={onItemActivated(pluginInjectionApi, indentationStateNode)}
				featureFlags={featureFlags}
				pluginInjectionApi={pluginInjectionApi}
			/>
		);
	}

	return (
		<Toolbar
			editorView={props.editorView}
			isReducedSpacing={isReducedSpacing}
			bulletListActive={bulletListActive}
			bulletListDisabled={bulletListDisabled}
			showIndentationButtons={showIndentationButtons}
			orderedListActive={orderedListActive}
			orderedListDisabled={orderedListDisabled}
			indentDisabled={indentDisabled}
			outdentDisabled={outdentDisabled}
			disabled={disabled}
			onItemActivated={onItemActivated(pluginInjectionApi, indentationStateNode)}
			featureFlags={featureFlags}
			pluginInjectionApi={pluginInjectionApi}
		/>
	);
}
