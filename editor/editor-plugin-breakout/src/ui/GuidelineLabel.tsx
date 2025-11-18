import React from 'react';

import { ResizerBreakoutModeLabel } from '@atlaskit/editor-common/resizer';
import type { BreakoutMode, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';

import type { BreakoutPlugin } from '../breakoutPluginType';
import type { ActiveGuidelineKey } from '../pm-plugins/resizing-plugin';

type GuidelineLabelProps = {
	api: ExtractInjectionAPI<BreakoutPlugin> | undefined;
	boundariesElement?: HTMLElement;
	editorView: EditorView;
	mountPoint?: HTMLElement;
	scrollableElement?: HTMLElement;
};

const GUIDELINE_KEY_TO_LAYOUT: Record<ActiveGuidelineKey, BreakoutMode> = {
	wide_left: 'wide',
	wide_right: 'wide',
	full_width_left: 'full-width',
	full_width_right: 'full-width',
	max_width_left: 'max',
	max_width_right: 'max',
};

export const GuidelineLabel = ({
	api,
	editorView,
	mountPoint,
	boundariesElement,
	scrollableElement,
}: GuidelineLabelProps) => {
	const breakoutNode = useSharedPluginStateSelector(api, 'breakout.breakoutNode');
	const activeGuidelineKey = useSharedPluginStateSelector(api, 'breakout.activeGuidelineKey');

	if (!breakoutNode || !activeGuidelineKey) {
		return null;
	}

	const element = findDomRefAtPos(breakoutNode.pos, editorView.domAtPos.bind(editorView));

	return (
		<Popup
			target={element && element instanceof HTMLElement ? element : undefined}
			offset={[0, 10]}
			alignY="bottom"
			alignX="center"
			mountTo={mountPoint}
			boundariesElement={boundariesElement}
			scrollableElement={scrollableElement}
			stick={true}
			forcePlacement={true}
		>
			<ResizerBreakoutModeLabel layout={GUIDELINE_KEY_TO_LAYOUT[activeGuidelineKey]} />
		</Popup>
	);
};
