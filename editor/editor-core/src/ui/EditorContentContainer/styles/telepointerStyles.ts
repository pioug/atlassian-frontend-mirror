/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors */
/* eslint-disable @atlaskit/ui-styling-standard/no-exported-styles */
/* eslint-disable @atlaskit/ui-styling-standard/use-compiled */
import { css, keyframes, type SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const pulseIn = keyframes({
	'0%, 100%': {
		transform: 'scaleX(0)',
		opacity: 0,
	},
	'10%': {
		transform: 'scaleX(1.4)',
		opacity: 1,
	},
	'15%, 85%': {
		transform: 'scaleX(1)',
		opacity: 1,
	},
});

const pulseOut = keyframes({
	'0%, 90%, 100%': {
		transform: 'scaleX(1)',
		opacity: 1,
	},
	'10%, 80%': {
		transform: 'scaleX(0)',
		opacity: 0,
	},
});

const pulseInDuringTr = keyframes({
	'0%, 95%': {
		transform: 'scaleX(1)',
		opacity: 1,
	},
	'100%': {
		transform: 'scaleX(0)',
		opacity: 0,
	},
});

const pulseOutDuringTr = keyframes({
	'100%': {
		transform: 'scaleX(1)',
		opacity: 1,
	},
	'0%, 90%': {
		transform: 'scaleX(0)',
		opacity: 0,
	},
});

export const telepointerColorAndCommonStyle: SerializedStyles = css({
	'.ProseMirror .telepointer': {
		position: 'relative',
		transition: 'opacity 200ms',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&.telepointer-selection:not(.inlineNodeView)': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: 1.2,
			pointerEvents: 'none',
			userSelect: 'none',
		},
		'&.telepointer-dim': {
			opacity: 0.2,
		},
		'&.color-0': {
			'--telepointer-participant-text-color': token('color.text.inverse'),
			'--telepointer-participant-bg-color': token('color.background.accent.red.bolder'),
		},
		'&.color-1': {
			'--telepointer-participant-text-color': token('color.text.inverse'),
			'--telepointer-participant-bg-color': token('color.background.accent.blue.bolder'),
		},
		'&.color-2': {
			'--telepointer-participant-text-color': token('color.text.inverse'),
			'--telepointer-participant-bg-color': token('color.background.accent.green.bolder'),
		},
		'&.color-3': {
			'--telepointer-participant-text-color': token('color.text.inverse'),
			'--telepointer-participant-bg-color': token('color.background.accent.yellow.bolder'),
		},
		'&.color-4': {
			'--telepointer-participant-text-color': token('color.text.inverse'),
			'--telepointer-participant-bg-color': token('color.background.accent.purple.bolder'),
		},
		'&.color-5': {
			'--telepointer-participant-text-color': token('color.text.inverse'),
			'--telepointer-participant-bg-color': token('color.background.accent.magenta.bolder'),
		},
		'&.color-6': {
			'--telepointer-participant-text-color': token('color.text.inverse'),
			'--telepointer-participant-bg-color': token('color.background.accent.teal.bolder'),
		},
		'&.color-7': {
			'--telepointer-participant-text-color': token('color.text.inverse'),
			'--telepointer-participant-bg-color': token('color.background.accent.orange.bolder'),
		},
		'&.color-8': {
			'--telepointer-participant-text-color': token('color.text.inverse'),
			'--telepointer-participant-bg-color': token('color.background.accent.lime.bolder'),
		},
		'&.color-9': {
			'--telepointer-participant-text-color': token('color.text.inverse'),
			'--telepointer-participant-bg-color': token('color.background.accent.gray.bolder'),
		},
		'&.color-10': {
			'--telepointer-participant-text-color': token('color.text.accent.gray.bolder'),
			'--telepointer-participant-bg-color': token('color.background.accent.blue.subtle'),
		},
		'&.color-11': {
			'--telepointer-participant-text-color': token('color.text.accent.gray.bolder'),
			'--telepointer-participant-bg-color': token('color.background.accent.red.subtle'),
		},
		'&.color-12': {
			'--telepointer-participant-text-color': token('color.text.accent.gray.bolder'),
			'--telepointer-participant-bg-color': token('color.background.accent.orange.subtle'),
		},
		'&.color-13': {
			'--telepointer-participant-text-color': token('color.text.accent.gray.bolder'),
			'--telepointer-participant-bg-color': token('color.background.accent.yellow.subtle'),
		},
		'&.color-14': {
			'--telepointer-participant-text-color': token('color.text.accent.gray.bolder'),
			'--telepointer-participant-bg-color': token('color.background.accent.green.subtle'),
		},
		'&.color-15': {
			'--telepointer-participant-text-color': token('color.text.accent.gray.bolder'),
			'--telepointer-participant-bg-color': token('color.background.accent.teal.subtle'),
		},
		'&.color-16': {
			'--telepointer-participant-text-color': token('color.text.accent.gray.bolder'),
			'--telepointer-participant-bg-color': token('color.background.accent.purple.subtle'),
		},
		'&.color-17': {
			'--telepointer-participant-text-color': token('color.text.accent.gray.bolder'),
			'--telepointer-participant-bg-color': token('color.background.accent.magenta.subtle'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'html:not([data-color-mode=dark]) &': {
			'--telepointer-participant-background-first-stop': '-850000%',
			'--telepointer-participant-background-second-stop': '150000%',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'html[data-color-mode=dark] &': {
			'--telepointer-participant-background-first-stop': '-800000%',
			'--telepointer-participant-background-second-stop': '200000%',
		},
		'&[class*="color-"]': {
			background:
				'linear-gradient(to bottom, var(--telepointer-participant-bg-color) var(--telepointer-participant-background-first-stop), transparent var(--telepointer-participant-background-second-stop))',
			'&::after': {
				backgroundColor: 'var(--telepointer-participant-bg-color)',
				color: 'var(--telepointer-participant-text-color)',
				borderColor: 'var(--telepointer-participant-bg-color)',
			},
		},
	},
});

export const telepointerStyle: SerializedStyles = css({
	'.ProseMirror .telepointer': {
		'&.telepointer-selection-badge': {
			'.telepointer-initial, .telepointer-fullname': {
				position: 'absolute',
				display: 'block',
				userSelect: 'none',
				whiteSpace: 'pre',
				top: -14,
				left: 0,
				font: token('font.body.small'),
				paddingLeft: token('space.050'),
				paddingRight: token('space.050'),
				borderRadius: `0 ${token('radius.xsmall')} ${token('radius.xsmall')} 0`,
			},
			'.telepointer-initial': {
				opacity: 1,
				transition: 'opacity 0.15s ease-out',
			},
			'.telepointer-fullname': {
				opacity: 0,
				transform: 'scaleX(0)',
				transformOrigin: 'top left',
				transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
			},
		},
		'&.telepointer-pulse-animate': {
			'.telepointer-initial': {
				animation: `${pulseOut} 2.5s ease-in-out`,
			},
			'.telepointer-fullname': {
				animation: `${pulseIn} 2.5s ease-in-out`,
			},
		},
		'&.telepointer-pulse-during-tr': {
			'.telepointer-initial': {
				animation: `${pulseOutDuringTr} 7500ms ease-in-out`,
			},
			'.telepointer-fullname': {
				animation: `${pulseInDuringTr} 7500ms ease-in-out`,
			},
		},
		'&:hover': {
			'.telepointer-initial': {
				opacity: 0,
				transitionDelay: '150ms',
			},
			'.telepointer-fullname': {
				transform: 'scaleX(1)',
				opacity: 1,
				zIndex: 1,
			},
		},
	},
});
