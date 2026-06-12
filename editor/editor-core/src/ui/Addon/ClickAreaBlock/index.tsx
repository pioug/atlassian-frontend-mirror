import React from 'react';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { clickAreaClickHandler } from '../click-area-helper';

import { ClickAreaBlockContainerCompiled } from './clickAreaBlock-compiled';
import { ClickAreaBlockContainerEmotion } from './clickAreaBlock-emotion';

const ClickAreaBlockContainerMigration = componentWithCondition(
	() => expValEquals('platform_editor_core_non_ecc_static_css', 'isEnabled', true),
	ClickAreaBlockContainerCompiled,
	ClickAreaBlockContainerEmotion,
);

export interface Props {
	children?: React.ReactNode;
	editorDisabled?: boolean;
	editorView?: EditorView;
}

export const ClickAreaBlock = ({
	editorView,
	editorDisabled,
	children,
}: Props): React.JSX.Element => {
	const handleMouseDown = React.useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			if (!editorView) {
				return;
			}

			if (!editorDisabled) {
				clickAreaClickHandler(editorView, event);
			}
		},
		[editorView, editorDisabled],
	);

	return (
		<ClickAreaBlockContainerMigration
			data-editor-click-wrapper
			data-testid="click-wrapper"
			onMouseDown={handleMouseDown}
			// This div is a presentational container that captures mouse events
			// for programmatic editor focus management, not user interaction.
			role="presentation"
		>
			{children}
		</ClickAreaBlockContainerMigration>
	);
};

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export default ClickAreaBlock;
