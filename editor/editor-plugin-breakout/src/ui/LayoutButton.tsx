/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import {
	ACTION,
	ACTION_SUBJECT,
	type BreakoutSupportedNodes,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { BreakoutCssClassName } from '@atlaskit/editor-common/styles';
import type { BreakoutMode, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import { getNextBreakoutMode, getTitle } from '@atlaskit/editor-common/utils';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { findDomRefAtPos, findParentDomRefOfType } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFullPageNarrowBreakout } from '@atlaskit/editor-shared-styles';
import GrowHorizontalIcon from '@atlaskit/icon/core/grow-horizontal';
import ShrinkHorizontalIcon from '@atlaskit/icon/core/shrink-horizontal';
import CollapseIcon from '@atlaskit/icon/glyph/editor/collapse';
import ExpandIcon from '@atlaskit/icon/glyph/editor/expand';
import { B300, N20A, N300 } from '@atlaskit/theme/colors';
import { layers } from '@atlaskit/theme/constants';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import type { BreakoutPlugin, BreakoutPluginState } from '../breakoutPluginType';
import { removeBreakout } from '../editor-commands/remove-breakout';
import { setBreakoutMode } from '../editor-commands/set-breakout-mode';
import { getPluginState } from '../pm-plugins/plugin-key';
import { isBreakoutMarkAllowed } from '../pm-plugins/utils/is-breakout-mark-allowed';
import { isSupportedNodeForBreakout } from '../pm-plugins/utils/is-supported-node';

const toolbarButtonWrapperStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&& button': {
		background: token('color.background.neutral', N20A),
		color: token('color.icon', N300),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		':hover': {
			background: token('color.background.neutral.hovered', B300),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
			color: `${token('color.icon', 'white')} !important`,
		},
	},
});

const toolbarButtonNarrowScreenStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries, @atlaskit/ui-styling-standard/no-imported-style-values,  @atlaskit/design-system/no-nested-styles,  @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	[`@container editor-area (max-width: ${akEditorFullPageNarrowBreakout}px)`]: {
		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&& button': {
			visibility: 'hidden',
			opacity: 0,
		},
	},
});

export interface Props {
	api: ExtractInjectionAPI<BreakoutPlugin> | undefined;
	boundariesElement?: HTMLElement;
	breakoutMode: BreakoutMode | undefined;
	editorView: EditorView | undefined;
	handleClick?: Function;
	isBreakoutNodePresent: boolean;
	isLivePage?: boolean;
	mountPoint?: HTMLElement;
	scrollableElement?: HTMLElement;
}

function getBreakoutNodeElement(
	pluginState: BreakoutPluginState,
	selection: Selection,
	editorView: EditorView,
): HTMLElement | undefined {
	if (!pluginState.breakoutNode) {
		return undefined;
	}

	if (selection instanceof NodeSelection && isSupportedNodeForBreakout(selection.node)) {
		// Ignored via go/ees005
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		return findDomRefAtPos(selection.from, editorView.domAtPos.bind(editorView)) as HTMLElement;
	}
	// Ignored via go/ees005
	// eslint-disable-next-line @atlaskit/editor/no-as-casting
	return findParentDomRefOfType(
		pluginState.breakoutNode.node.type,
		editorView.domAtPos.bind(editorView),
	)(selection) as HTMLElement;
}

const LayoutButton = ({
	intl: { formatMessage },
	mountPoint,
	boundariesElement,
	scrollableElement,
	editorView,
	isLivePage,
	isBreakoutNodePresent,
	breakoutMode: breakoutModeProp,
	api,
}: Props & WrappedComponentProps) => {
	const handleClick = useCallback(
		(breakoutMode: BreakoutMode) => {
			if (expValEquals('platform_editor_hydratable_ui', 'isEnabled', true) && !editorView) {
				return;
			}
			// Remove ! during platform_editor_hydratable_ui cleanup
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const { state, dispatch } = editorView!;
			const breakoutNode = getPluginState(state)?.breakoutNode;
			if (['wide', 'full-width'].indexOf(breakoutMode) !== -1) {
				setBreakoutMode(breakoutMode, isLivePage)(state, dispatch);

				api?.analytics?.actions.fireAnalyticsEvent({
					action: ACTION.CHANGED_BREAKOUT_MODE,
					actionSubject: ACTION_SUBJECT.ELEMENT,
					eventType: EVENT_TYPE.TRACK,
					attributes: {
						mode: breakoutMode as 'center' | 'wide' | 'full-width',
						nodeType: breakoutNode?.node.type.name as BreakoutSupportedNodes,
					},
				});
			} else {
				removeBreakout(isLivePage)(state, dispatch);

				api?.analytics?.actions.fireAnalyticsEvent({
					action: ACTION.CHANGED_BREAKOUT_MODE,
					actionSubject: ACTION_SUBJECT.ELEMENT,
					eventType: EVENT_TYPE.TRACK,
					attributes: {
						mode: 'center',
						nodeType: breakoutNode?.node.type.name as BreakoutSupportedNodes,
					},
				});
			}
		},
		[api?.analytics?.actions, editorView, isLivePage],
	);

	if (expValEquals('platform_editor_hydratable_ui', 'isEnabled', true) && !editorView) {
		return null;
	}

	// Remove ! during platform_editor_hydratable_ui cleanup
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	if (!isBreakoutNodePresent || !isBreakoutMarkAllowed(editorView!.state)) {
		return null;
	}

	const breakoutMode = breakoutModeProp;
	const titleMessage = getTitle(breakoutMode);
	const title = formatMessage(titleMessage);
	const nextBreakoutMode = getNextBreakoutMode(breakoutMode);
	const belowOtherPopupsZIndex = layers.layer() - 1;

	// Remove ! during platform_editor_hydratable_ui cleanup
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const pluginState = getPluginState(editorView!.state);

	if (!pluginState) {
		return null;
	}

	// Remove ! during platform_editor_hydratable_ui cleanup
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	let element = getBreakoutNodeElement(pluginState, editorView!.state.selection, editorView!);
	if (!element) {
		return null;
	}

	const closestEl = element.querySelector(`.${BreakoutCssClassName.BREAKOUT_MARK_DOM}`);

	if (closestEl && closestEl.firstChild) {
		// Ignored via go/ees005
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		element = closestEl.firstChild as HTMLElement;
	}

	return (
		<Popup
			ariaLabel={title}
			target={element}
			offset={[5, 0]}
			alignY="start"
			alignX="end"
			mountTo={mountPoint}
			boundariesElement={boundariesElement}
			scrollableElement={scrollableElement}
			stick={true}
			forcePlacement={true}
			zIndex={belowOtherPopupsZIndex}
		>
			<div
				css={[
					toolbarButtonWrapperStyles,
					editorExperiment('platform_editor_preview_panel_responsiveness', true) &&
						toolbarButtonNarrowScreenStyles,
				]}
			>
				<ToolbarButton
					title={title}
					testId={titleMessage.id}
					onClick={() => handleClick(nextBreakoutMode)}
					iconBefore={
						breakoutMode === 'full-width' ? (
							<ShrinkHorizontalIcon
								label={title}
								LEGACY_fallbackIcon={CollapseIcon}
								spacing="spacious"
							/>
						) : (
							<GrowHorizontalIcon
								label={title}
								LEGACY_fallbackIcon={ExpandIcon}
								spacing="spacious"
							/>
						)
					}
				/>
			</div>
		</Popup>
	);
};

LayoutButton.displayName = 'LayoutButton';

export default injectIntl(LayoutButton);
