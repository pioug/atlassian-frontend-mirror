/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { akEditorFullPageNarrowBreakout } from '@atlaskit/editor-shared-styles';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BlockControlsPlugin } from '../blockControlsPluginType';

interface VisibilityContainerProps {
	api?: ExtractInjectionAPI<BlockControlsPlugin>;
	children: React.ReactNode;
}

const baseStyles = xcss({
	transition: 'opacity 0.1s ease-in-out, visibility 0.1s ease-in-out',
});

const visibleStyles = xcss({
	opacity: 1,
	visibility: 'visible',
});

const hiddenStyles = xcss({
	opacity: 0,
	visibility: 'hidden',
});

const baseStylesCSS = css({
	transition: 'opacity 0.1s ease-in-out, visibility 0.1s ease-in-out',

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	[`@container editor-area (max-width: ${akEditorFullPageNarrowBreakout}px)`]: {
		opacity: 0,
		visibility: 'hidden',
	},
});

const visibleStylesCSS = css({
	opacity: 1,
	visibility: 'visible',
});

const hiddenStylesCSS = css({
	opacity: 0,
	visibility: 'hidden',
});

export const VisibilityContainer = ({ api, children }: VisibilityContainerProps) => {
	const isTypeAheadOpen = useSharedPluginStateSelector(api, 'typeAhead.isOpen');
	const isEditing = useSharedPluginStateSelector(api, 'blockControls.isEditing');
	const isMouseOut = useSharedPluginStateSelector(api, 'blockControls.isMouseOut');

	// when ai streaming, hide the block controls
	const userIntent = useSharedPluginStateSelector(api, 'userIntent.currentUserIntent');

	const shouldHide = isTypeAheadOpen || isEditing || isMouseOut || userIntent === 'aiStreaming';

	if (
		editorExperiment('platform_editor_preview_panel_responsiveness', true, {
			exposure: true,
		})
	) {
		return (
			<div css={[baseStylesCSS, shouldHide ? hiddenStylesCSS : visibleStylesCSS]}>{children}</div>
		);
	}

	return <Box xcss={[baseStyles, shouldHide ? hiddenStyles : visibleStyles]}>{children}</Box>;
};
