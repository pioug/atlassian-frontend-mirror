import React from 'react';
import type { NodeContent } from '../types';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/editor-experiment';

export default function LayoutSection(
	props: React.PropsWithChildren<{
		getContent?: () => NodeContent | undefined;
		localId?: string;
	}>,
): React.JSX.Element {
	const columnCount = props.getContent?.()?.length;

	return editorExperiment('advanced_layouts', true) ? (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		<div className="layout-section-container" data-local-id={props.localId}>
			<div data-layout-section data-layout-columns={columnCount}>
				{props.children}
			</div>
		</div>
	) : (
		<div data-layout-section data-local-id={props.localId}>
			{props.children}
		</div>
	);
}
