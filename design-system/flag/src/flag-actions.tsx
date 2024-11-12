/* eslint-disable @atlaskit/design-system/no-nested-styles */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ComponentType, type CSSProperties, type FC } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/custom-theme-button';
import type { CustomThemeButtonProps } from '@atlaskit/button/types';
import Inline from '@atlaskit/primitives/inline';
import { token } from '@atlaskit/tokens';

import {
	DEFAULT_APPEARANCE,
	VAR_BG_COLOR,
	VAR_BG_COLOR_ACTIVE,
	VAR_BG_COLOR_HOVER,
	VAR_COLOR,
} from './constants';
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
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		padding: `0 ${token('space.100', '8px')} !important`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		background: `var(${VAR_BG_COLOR})`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		color: `var(${VAR_COLOR}) !important`,
		fontWeight: token('font.weight.medium', '500'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&&:hover, &&:active, a&&:hover, a&&:active': {
		textDecoration: 'underline',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&&:hover': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		backgroundColor: `var(${VAR_BG_COLOR_HOVER})`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&&:active': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		backgroundColor: `var(${VAR_BG_COLOR_ACTIVE})`,
	},
});

const appearanceNormalButtonStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&&, a&&': {
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
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
		<span css={!isBold && appearanceNormalActionsContainerStyles}>
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
								[VAR_COLOR]: actionTextColor[appearance],
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
								[VAR_BG_COLOR]: actionBackgroundColor[appearance].default,
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
								[VAR_BG_COLOR_HOVER]: actionBackgroundColor[appearance].pressed,
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
								[VAR_BG_COLOR_ACTIVE]: actionBackgroundColor[appearance].active,
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
							} as CSSProperties
						}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
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
