/* eslint-disable @atlaskit/design-system/no-nested-styles */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ComponentType, type CSSProperties, type FC } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/custom-theme-button';
import type { CustomThemeButtonProps } from '@atlaskit/button/types';
import { Inline } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { DEFAULT_APPEARANCE } from './constants';
import { actionBackgroundColor, actionTextColor } from './theme';
import type { ActionsType, AppearanceTypes } from './types';

type FlagActionsProps = {
	appearance: AppearanceTypes;
	actions: ActionsType;
	linkComponent?: ComponentType<CustomThemeButtonProps>;
	testId?: string;
};

const buttonStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&&, a&&': {
		background: 'var(--bg-color)',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		color: 'var(--color) !important',
		fontWeight: token('font.weight.medium', '500'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		paddingBlockEnd: '0 !important',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		paddingBlockStart: '0 !important',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		paddingInlineEnd: `${token('space.100', '8px')} !important`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		paddingInlineStart: `${token('space.100', '8px')} !important`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&&:hover, &&:active, a&&:hover, a&&:active': {
		textDecoration: 'underline',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&&:hover': {
		backgroundColor: 'var(--bg-color-hover)',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&&:active': {
		backgroundColor: 'var(--bg-color-active)',
	},
});

const fontStyles = css({
	font: token('font.body'),
});

const appearanceNormalButtonStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&&, a&&': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		padding: '0 !important',
	},
});

const appearanceNormalActionsContainerStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&&, a&&': {
		transform: 'translateX(-2px)',
	},
});

const FlagActions: FC<FlagActionsProps> = (props) => {
	const { appearance = DEFAULT_APPEARANCE, actions = [], linkComponent, testId } = props;
	if (!actions.length) {
		return null;
	}

	const isBold = appearance !== DEFAULT_APPEARANCE;

	return (
		<span
			css={[
				!isBold && appearanceNormalActionsContainerStyles,
				/**
				 * We are setting the font styles here for the custom theme button to inherit.
				 * Custom theme sets its font to "inherit", so picks up these font styles.
				 *
				 * The alternative is to add styles for each pseudo state, however this ended up being a lot more
				 * complex and ended up with subtle differences across different pseudo states that would need to be handled.
				 *
				 * This approach is as close to the current behaviour as possible - where the button simply inherits the
				 * font from its parent.
				 */
				fontStyles,
			]}
		>
			<Inline
				space="space.100"
				shouldWrap
				alignBlock="center"
				separator={isBold ? undefined : '·'}
				testId={testId && `${testId}-actions`}
			>
				{actions.map((action, index) => (
					<Button
						onClick={action.onClick}
						href={action.href}
						target={action.target}
						appearance={isBold ? 'default' : 'link'}
						component={linkComponent}
						spacing="compact"
						testId={action.testId}
						key={index}
						style={
							{
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								'--color': actionTextColor[appearance],
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
								'--bg-color': actionBackgroundColor[appearance].default,
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
								'--bg-color-hover': actionBackgroundColor[appearance].pressed,
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
								'--bg-color-active': actionBackgroundColor[appearance].active,
							} as CSSProperties
						}
						css={[buttonStyles, appearance === DEFAULT_APPEARANCE && appearanceNormalButtonStyles]}
					>
						{action.content}
					</Button>
				))}
			</Inline>
		</span>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default FlagActions;
