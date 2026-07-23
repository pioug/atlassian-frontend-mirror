/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors,
	@repo/internal/deprecations/deprecation-ticket-required,
	@atlaskit/ui-styling-standard/no-exported-styles */
/* eslint-disable @atlaskit/ui-styling-standard/use-compiled */
import { css, keyframes } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// Agent-edit shimmer (CCI-18033) styles, kept in their own file so they're easy to find and remove
// if the approach changes. Applied only when the `platform_editor_agent_be_streaming` experiment is
// on (the collab plugin adds the decorations); dormant otherwise.
//
// @deprecated This style has been migrated to Compiled CSS, under experiment
// platform_editor_core_static_css. If you change this, also update the corresponding
// `agentShimmerStyles` block in
// packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx

// Skeleton-loader sweep across the agent-authored range.
const agentShimmer = keyframes({
	from: { backgroundPosition: '200% 0' },
	to: { backgroundPosition: '-200% 0' },
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports
export const agentShimmerStyle: SerializedStyles = css({
	// Skeleton-loader bar over the agent-authored range (text hidden, grey skeleton with a moving
	// highlight), plus a Rovo AI telepointer/cursor at the end of the range.
	'.ProseMirror .collab-agent-shimmer': {
		animationDuration: '1.25s',
		animationIterationCount: 'infinite',
		animationName: agentShimmer,
		animationTimingFunction: 'linear',
		backgroundColor: token('color.skeleton'),
		backgroundImage: `linear-gradient(90deg, ${token('color.skeleton')} 0%, ${token('color.skeleton.subtle')} 50%, ${token('color.skeleton')} 100%)`,
		backgroundSize: '200% 100%',
		borderRadius: token('radius.xsmall'),
		boxDecorationBreak: 'clone',
		color: 'transparent',
		caretColor: 'transparent',
	},
	'.ProseMirror .ai-in-editor-telepointer': {
		position: 'relative',
		zIndex: 1,
		'& > .ai-in-editor-telepointer-label': {
			position: 'absolute',
			boxSizing: 'border-box',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			padding: token('space.025'),
			gap: token('space.075'),
			height: 16,
			top: token('space.0'),
			left: token('space.0'),
			borderRadius: `0 ${token('space.050')} ${token('space.050')} 0`,
			border: `${token('border.width')} solid transparent`,
			background: `linear-gradient(${token('color.text')}, ${token('color.text')}) padding-box, conic-gradient(from 270deg at 50% 50%, #1868db 0deg, #1868db 115deg, #fca700 115deg, #fca700 180deg, #bf63f3 180deg, #bf63f3 310deg, #82b536 310deg, #82b536 359.96deg, #1868db 360deg) border-box`,
			fontFamily: token('font.family.body'),
			fontWeight: token('font.weight.semibold'),
			// Match the AI in-editor telepointer label's fixed 10px/9px sizing (no exact typography token).
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			fontSize: 10,
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: '9px',
			textAlign: 'center',
			whiteSpace: 'pre',
			color: token('color.text.inverse'),
		},
		'&::after': {
			content: "''",
			position: 'absolute',
			width: 1,
			height: 24,
			top: token('space.0'),
			left: token('space.0'),
			background: token('color.border.brand'),
		},
	},
});
