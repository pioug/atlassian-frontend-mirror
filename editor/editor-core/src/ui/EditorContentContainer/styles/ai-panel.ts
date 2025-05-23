// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, keyframes } from '@emotion/react';

import { token } from '@atlaskit/tokens';

/**
 * aiPanelStyles
 * was imported from packages/editor/editor-core/src/ui/ContentStyles/ai-panels.ts
 */
const isFirefox: boolean =
	typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

const rotationAnimation = keyframes({
	'0%': {
		'--panel-gradient-angle': '0deg',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		...(isFirefox ? { backgroundPosition: '100%' } : {}),
	},
	'100%': {
		'--panel-gradient-angle': '360deg',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		...(isFirefox ? { backgroundPosition: '-100%' } : {}),
	},
});

const aiPrismColor = {
	['prism.border.step.1']: {
		light: '#0065FF',
		dark: '#0065FF80',
	},
	['prism.border.step.2']: {
		light: '#0469FF',
		dark: '#0469FF80',
	},
	['prism.border.step.3']: {
		light: '#BF63F3',
		dark: '#BF63F380',
	},
	['prism.border.step.4']: {
		light: '#FFA900',
		dark: '#FFA90080',
	},
};

const prismBorderAnimationStyles = css({
	'&::before, &::after': {
		animationName: rotationAnimation,
		animationDuration: '2s',
		animationTimingFunction: 'linear',
		animationIterationCount: 'infinite',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		...(isFirefox ? { animationDirection: 'normal', animationDuration: '1s' } : {}),
		'@media (prefers-reduced-motion)': {
			animation: 'none',
		},
	},
});

const prismBorderBaseStyles = css({
	content: "''",
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	position: 'absolute',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	zIndex: -1,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: `calc(100% + 2px)`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: `calc(100% + 2px)`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	top: `-1px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	left: `-1px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: `calc(${token('border.radius.100', '3px')} + 1px)`,
	transform: 'translate3d(0, 0, 0)',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	...(isFirefox
		? {
				background: `linear-gradient(90deg,
								${aiPrismColor['prism.border.step.1']['light']} 0%,
								${aiPrismColor['prism.border.step.2']['light']} 12%,
								${aiPrismColor['prism.border.step.3']['light']} 24%,
								${aiPrismColor['prism.border.step.4']['light']} 48%,
								${aiPrismColor['prism.border.step.3']['light']} 64%,
								${aiPrismColor['prism.border.step.2']['light']} 80%,
								${aiPrismColor['prism.border.step.1']['light']} 100%
							)`,
				backgroundSize: '200%',
			}
		: {
				background: `conic-gradient(
								from var(--panel-gradient-angle, 270deg),
								${aiPrismColor['prism.border.step.1']['light']} 0%,
								${aiPrismColor['prism.border.step.2']['light']} 20%,
								${aiPrismColor['prism.border.step.3']['light']} 50%,
								${aiPrismColor['prism.border.step.4']['light']} 56%,
								${aiPrismColor['prism.border.step.1']['light']} 100%
							)`,
			}),
});

const prismBorderDarkStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	...(isFirefox
		? {
				background: `linear-gradient(90deg,
								${aiPrismColor['prism.border.step.1']['dark']} 0%,
								${aiPrismColor['prism.border.step.2']['dark']} 12%,
								${aiPrismColor['prism.border.step.3']['dark']} 24%,
								${aiPrismColor['prism.border.step.4']['dark']} 48%,
								${aiPrismColor['prism.border.step.3']['dark']} 64%,
								${aiPrismColor['prism.border.step.2']['dark']} 80%,
								${aiPrismColor['prism.border.step.1']['dark']} 100%
							)`,
				backgroundSize: '200%',
			}
		: {
				background: `conic-gradient(
								from var(--panel-gradient-angle, 270deg),
								${aiPrismColor['prism.border.step.1']['dark']} 0%,
								${aiPrismColor['prism.border.step.2']['dark']} 20%,
								${aiPrismColor['prism.border.step.3']['dark']} 50%,
								${aiPrismColor['prism.border.step.4']['dark']} 56%,
								${aiPrismColor['prism.border.step.1']['dark']} 100%
							)`,
			}),
});

const prismBorderHoverStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	background: token('color.border.input'),
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const aiPanelBaseStyles = css`
	@property --panel-gradient-angle {
		syntax: '<angle>';
		initial-value: 270deg;
		inherits: false;
	}

	div[extensionType='com.atlassian.ai-blocks'] {
		/* This hides the label for the extension */
		.extension-label {
			display: none;
		}

		/* This styles the ai panel correctly when its just sitting on the page and there
		is no user interaction */
		.extension-container {
			position: relative;
			box-shadow: none;
			overflow: unset;
			background-color: ${token('elevation.surface')} !important;
			&::before,
			&::after {
				${prismBorderBaseStyles}
			}
			&.with-hover-border {
				&::before,
				&::after {
					${prismBorderHoverStyles}
				}
			}
			& .with-margin-styles {
				background-color: ${token('elevation.surface')} !important;
				border-radius: ${token('border.radius.100', '3px')};
			}
		}
	}

	/* This styles the ai panel correctly when its streaming */
	div[extensionType='com.atlassian.ai-blocks']:has(.streaming) {
		.extension-container {
			box-shadow: none;
			overflow: unset;
			${prismBorderAnimationStyles}
			&::before,
			&::after {
				${prismBorderBaseStyles}
			}
		}
	}

	/* This styles the ai panel correctly when a user is hovering over the delete button in the floating panel */
	div[extensionType='com.atlassian.ai-blocks'].danger {
		.extension-container {
			box-shadow: 0 0 0 1px ${token('color.border.danger')};
		}
	}

	/* This removes the margin from the action list when inside an ai panel */
	div[extensiontype='com.atlassian.ai-blocks'][extensionkey='ai-action-items-block:aiActionItemsBodiedExtension'] {
		div[data-node-type='actionList'] {
			margin: 0 !important;
		}
	}
`;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const aiPanelDarkStyles = css`
	div[extensionType='com.atlassian.ai-blocks'] {
		.extension-container {
			&::before,
			&::after {
				${prismBorderDarkStyles}
			}
		}
	}

	/* This styles the ai panel correctly when its streaming */
	div[extensionType='com.atlassian.ai-blocks']:has(.streaming) {
		.extension-container {
			&::before,
			&::after {
				${prismBorderDarkStyles}
			}
		}
	}
`;
