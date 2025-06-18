/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@atlaskit/css';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { ExtractInjectionAPI, FeatureFlags } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { IndentationButtonNode } from '../pm-plugins/indentation-buttons';
import type { ToolbarListsIndentationPlugin } from '../toolbarListsIndentationPluginType';
import { ToolbarType } from '../types';

import { onItemActivated } from './onItemActivated';
import { Toolbar } from './Toolbar';
import { ToolbarDropdown } from './ToolbarDropdown';
import { getInputMethod } from './utils/input-method';

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
	toolbarType: ToolbarType;
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
		toolbarType,
	} = props;

	const inputMethod = toolbarType ? getInputMethod(toolbarType) : INPUT_METHOD.TOOLBAR;

	if (
		isSmall ||
		toolbarType === ToolbarType.FLOATING ||
		editorExperiment('platform_editor_controls', 'variant1')
	) {
		const areAllOptionsDisabled = [
			bulletListDisabled,
			orderedListDisabled,
			indentDisabled,
			outdentDisabled,
		].every((item) => Boolean(item) === true);
		const isDisabled = disabled || areAllOptionsDisabled;

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
				disabled={isDisabled}
				onItemActivated={onItemActivated(pluginInjectionApi, indentationStateNode, inputMethod)}
				featureFlags={featureFlags}
				pluginInjectionApi={pluginInjectionApi}
				toolbarType={toolbarType}
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
			onItemActivated={onItemActivated(pluginInjectionApi, indentationStateNode, inputMethod)}
			featureFlags={featureFlags}
			pluginInjectionApi={pluginInjectionApi}
		/>
	);
}
