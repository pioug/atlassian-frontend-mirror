import { css, keyframes } from '@emotion/react';

import {
	akEditorDeleteBackground,
	akEditorSelectedNodeClassName,
} from '@atlaskit/editor-shared-styles';
import { N0, N20 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const rotationAnimation = keyframes({
	'0%': {
		'--panel-gradient-angle': '0deg',
	},
	'100%': {
		'--panel-gradient-angle': '360deg',
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
		animation: `${rotationAnimation} linear 2s infinite`,
		'@media (prefers-reduced-motion)': {
			animation: 'none',
		},
	},
});

const prismBorderStyles = (
	colorMode?: 'light' | 'dark',
	sizeOffset?: number,
	positionOffset?: number,
) =>
	css({
		content: "''",
		position: 'absolute',
		background: `conic-gradient( from var(--panel-gradient-angle, 180deg) at 50% 50%, ${
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			aiPrismColor['prism.border.step.4'][colorMode ?? 'light']
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		} -52.2deg, ${aiPrismColor['prism.border.step.1'][colorMode ?? 'light']} 89.76deg, ${
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			aiPrismColor['prism.border.step.2'][colorMode ?? 'light']
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		} 145.8deg, ${aiPrismColor['prism.border.step.3'][colorMode ?? 'light']} 262.8deg, ${
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			aiPrismColor['prism.border.step.4'][colorMode ?? 'light']
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		} 307.8deg, ${aiPrismColor['prism.border.step.1'][colorMode ?? 'light']} 449.76deg )`,
		zIndex: -1,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		width: `calc(100% + ${sizeOffset}px)`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: `calc(100% + ${sizeOffset}px)`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		top: `${positionOffset}px`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		left: `${positionOffset}px`,
		borderRadius: token('border.radius.200', '5px'),
		transform: 'translate3d(0, 0, 0)',
	});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Ignored via go/DSP-18766
export const aiPanelStyles = (colorMode?: 'light' | 'dark') => css`
	@property --panel-gradient-angle {
		syntax: '<angle>';
		initial-value: 180deg;
		inherits: false;
	}

	// The .with-border style is only present when the new macro styles are applied
	// TODO: Remove this once new macro styles have been adopted
	div[extensiontype='com.atlassian.ai-blocks'] {
		&.${akEditorSelectedNodeClassName}:has(.streaming) {
			& .extension-container {
				box-shadow: none !important;
				${prismBorderAnimationStyles}
			}
		}

		.danger > .extension-container {
			background-color: ${token('color.background.danger', akEditorDeleteBackground)};
		}

		.extension-container {
			overflow: visible;
			background-color: ${token('color.background.accent.gray.subtlest', N20)};
			position: relative;
			border-radius: 4px;
			&::before,
			&::after {
				${prismBorderStyles(colorMode, 2, -1)}
			}
			.extension-overflow-wrapper {
				border-radius: inherit;
				box-shadow: inherit;
				background-color: inherit;
			}
			&.with-border {
				border: 1px solid ${token('elevation.surface.overlay', N0)};
			}
			&.with-hover-border {
				border: 1px solid ${token('elevation.surface.overlay', N0)};
			}
		}
	}

	div[extensiontype='com.atlassian.ai-blocks']:has(.with-border) {
		.extension-container {
			background-color: ${token('elevation.surface.overlay', N0)};
			.extension-overflow-wrapper {
				box-shadow: none !important;
			}
		}

		.extension-title {
			display: none !important;
		}

		&:not(.${akEditorSelectedNodeClassName}),
		&:not(.danger) {
			.extension-container {
				&::before,
				&::after {
					${prismBorderStyles(colorMode, 4, -2)}
				}
				&.wider-layout {
					&::after,
					&::before {
						${prismBorderStyles(colorMode, 2, -1)}
					}
				}
			}
		}

		&.${akEditorSelectedNodeClassName}, &.danger {
			.extension-container {
				&.wider-layout {
					&::after,
					&::before {
						content: none;
					}
				}
			}
		}
	}

	div[extensiontype='com.atlassian.ai-blocks'][extensionkey='ai-action-items-block:aiActionItemsBodiedExtension'] {
		div[data-node-type='actionList'] {
			margin: 0 !important;
		}
	}
`;
