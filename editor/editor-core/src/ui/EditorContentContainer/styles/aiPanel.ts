// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, keyframes } from '@emotion/react';

import { token } from '@atlaskit/tokens';

/**
 * aiPanelStyles
 * was imported from packages/editor/editor-core/src/ui/ContentStyles/ai-panels.ts
 */

const rotationAnimation = keyframes({
	'0%': {
		'--panel-gradient-angle': '0deg',
	},
	'100%': {
		'--panel-gradient-angle': '360deg',
	},
});

const rotationAnimationFirefox = keyframes({
	'0%': {
		'--panel-gradient-angle': '0deg',
		backgroundPosition: '100%',
	},
	'100%': {
		'--panel-gradient-angle': '360deg',
		backgroundPosition: '-100%',
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

const aiPrismColorStep1Light = aiPrismColor['prism.border.step.1']['light'];
const aiPrismColorStep2Light = aiPrismColor['prism.border.step.2']['light'];
const aiPrismColorStep3Light = aiPrismColor['prism.border.step.3']['light'];
const aiPrismColorStep4Light = aiPrismColor['prism.border.step.4']['light'];

const aiPrismColorStep1Dark = aiPrismColor['prism.border.step.1']['dark'];
const aiPrismColorStep2Dark = aiPrismColor['prism.border.step.2']['dark'];
const aiPrismColorStep3Dark = aiPrismColor['prism.border.step.3']['dark'];
const aiPrismColorStep4Dark = aiPrismColor['prism.border.step.4']['dark'];

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
const prismBorderBaseBackgroundFirefox = `linear-gradient(90deg, ${aiPrismColorStep1Light} 0%, ${aiPrismColorStep2Light} 12%, ${aiPrismColorStep3Light} 24%, ${aiPrismColorStep4Light} 48%, ${aiPrismColorStep3Light} 64%, ${aiPrismColorStep2Light} 80%, ${aiPrismColorStep1Light} 100%)`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
const prismBorderBaseBackground = `conic-gradient(from var(--panel-gradient-angle, 270deg), ${aiPrismColorStep1Light} 0%, ${aiPrismColorStep2Light} 20%, ${aiPrismColorStep3Light} 50%, ${aiPrismColorStep4Light} 56%, ${aiPrismColorStep1Light} 100%)`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
const prismBorderDarkBackgroundFirefox = `linear-gradient(90deg, ${aiPrismColorStep1Dark} 0%, ${aiPrismColorStep2Dark} 12%, ${aiPrismColorStep3Dark} 24%, ${aiPrismColorStep4Dark} 48%, ${aiPrismColorStep3Dark} 64%, ${aiPrismColorStep2Dark} 80%, ${aiPrismColorStep1Dark} 100%)`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
const prismBorderDarkBackground = `conic-gradient(from var(--panel-gradient-angle, 270deg), ${aiPrismColorStep1Dark} 0%, ${aiPrismColorStep2Dark} 20%, ${aiPrismColorStep3Dark} 50%, ${aiPrismColorStep4Dark} 56%, ${aiPrismColorStep1Dark} 100%)`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const aiPanelBaseStyles = css({
	'@property --panel-gradient-angle': {
		syntax: '<angle>',
		initialValue: '270deg',
		inherits: false,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'div[extensionType="com.atlassian.ai-blocks"]': {
		/* This hides the label for the extension */
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.extension-label': {
			display: 'none',
		},
		/* This styles the ai panel correctly when its just sitting on the page and there
		is no user interaction */
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.extension-container': {
			position: 'relative',
			boxShadow: 'none',
			overflow: 'unset',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			backgroundColor: `${token('elevation.surface')} !important`,
			// prismBorderBaseStyles
			'&::before, &::after': {
				content: "''",
				position: 'absolute',
				zIndex: -1,
				width: `calc(100% + 2px)`,
				height: `calc(100% + 2px)`,
				top: `-1px`,
				left: `-1px`,
				borderRadius: `calc(${token('border.radius.100', '3px')} + 1px)`,
				transform: 'translate3d(0, 0, 0)',
				background: prismBorderBaseBackground,
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.with-hover-border': {
				'&::before, &::after': {
					//prismBorderHoverStyles
					background: token('color.border.input'),
				},
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'& .with-margin-styles': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				backgroundColor: `${token('elevation.surface')} !important`,
				borderRadius: token('border.radius.100', '3px'),
			},
		},
	},

	/* This styles the ai panel correctly when its streaming */
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'div[extensionType="com.atlassian.ai-blocks"]:has(.streaming)': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.extension-container': {
			'&::before, &::after': {
				// prismBorderAnimationStyles
				animationName: rotationAnimation,
				animationDuration: '2s',
				animationTimingFunction: 'linear',
				animationIterationCount: 'infinite',
				'@media (prefers-reduced-motion)': {
					animation: 'none',
				},
			},
		},
	},

	/* This styles the ai panel correctly when a user is hovering over the delete button in the floating panel */
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'div[extensionType="com.atlassian.ai-blocks"].danger': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.extension-container': {
			boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
		},
	},

	/* This removes the margin from the action list when inside an ai panel */
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'div[extensiontype="com.atlassian.ai-blocks"][extensionkey="ai-action-items-block:aiActionItemsBodiedExtension"]':
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'div[data-node-type="actionList"]': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				margin: '0 !important',
			},
		},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const aiPanelBaseFirefoxStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'div[extensionType="com.atlassian.ai-blocks"]': {
		'&::before, &::after': {
			background: prismBorderBaseBackgroundFirefox,
			backgroundSize: '200%',
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'div[extensionType="com.atlassian.ai-blocks"]:has(.streaming)': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.extension-container': {
			'&::before, &::after': {
				animationName: rotationAnimationFirefox,
				animationDirection: 'normal',
				animationDuration: '1s',
			},
		},
	},
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const aiPanelDarkStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'div[extensionType="com.atlassian.ai-blocks"]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.extension-container': {
			'&::before, &::after': {
				background: prismBorderDarkBackground,
			},
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const aiPanelDarkFirefoxStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'div[extensionType="com.atlassian.ai-blocks"]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.extension-container': {
			'&::before, &::after': {
				background: prismBorderDarkBackgroundFirefox,
				backgroundSize: '200%',
			},
		},
	},
});
