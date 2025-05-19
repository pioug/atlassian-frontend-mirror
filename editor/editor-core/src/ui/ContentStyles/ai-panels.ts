/**
 * TODO ED-26957 - remove legacy styles when static emotion refactor is complete
 * We are moving this to new location under FF: platform_editor_core_static_emotion
 * New location: packages/editor/editor-core/src/ui/EditorContentContainer.tsx
 * If you are making updates to this file, please updates in new location as well.
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, keyframes } from '@emotion/react';

import { token } from '@atlaskit/tokens';

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

const prismBorderStyles = (colorMode?: 'light' | 'dark', hover?: boolean) =>
	css({
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
		...(hover
			? {
					background: token('color.border.input'),
				}
			: isFirefox
				? {
						background: `linear-gradient(90deg,
								${aiPrismColor['prism.border.step.1'][colorMode ?? 'light']} 0%,
								${aiPrismColor['prism.border.step.2'][colorMode ?? 'light']} 12%,
								${aiPrismColor['prism.border.step.3'][colorMode ?? 'light']} 24%,
								${aiPrismColor['prism.border.step.4'][colorMode ?? 'light']} 48%,
								${aiPrismColor['prism.border.step.3'][colorMode ?? 'light']} 64%,
								${aiPrismColor['prism.border.step.2'][colorMode ?? 'light']} 80%,
								${aiPrismColor['prism.border.step.1'][colorMode ?? 'light']} 100%
							)`,
						backgroundSize: '200%',
					}
				: {
						background: `conic-gradient(
								from var(--panel-gradient-angle, 270deg),
								${aiPrismColor['prism.border.step.1'][colorMode ?? 'light']} 0%,
								${aiPrismColor['prism.border.step.2'][colorMode ?? 'light']} 20%,
								${aiPrismColor['prism.border.step.3'][colorMode ?? 'light']} 50%,
								${aiPrismColor['prism.border.step.4'][colorMode ?? 'light']} 56%,
								${aiPrismColor['prism.border.step.1'][colorMode ?? 'light']} 100%
							)`,
					}),
	});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Ignored via go/DSP-18766
export const aiPanelStyles = (colorMode?: 'light' | 'dark') => css`
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
				${prismBorderStyles(colorMode)}
			}
			&.with-hover-border {
				&::before,
				&::after {
					${prismBorderStyles(colorMode, true)}
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
				${prismBorderStyles(colorMode)}
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
