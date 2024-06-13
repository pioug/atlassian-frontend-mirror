/** @jsx jsx */
import { Fragment } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/custom-theme-button';
import AddIcon from '@atlaskit/icon/glyph/editor/add';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { CREATE_BREAKPOINT } from '../../common/constants';
import { useTheme } from '../../theme';
import { IconButton } from '../IconButton';

import { getCreateButtonTheme } from './styles';
import { type CreateProps } from './types';

const wrapperStyles = css({
	display: 'flex',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& [data-hide-on-smallscreens]': {
		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		[`@media (max-width: ${CREATE_BREAKPOINT - 1}px)`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
			display: 'none !important',
		},
	},
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& [data-hide-on-largescreens]': {
		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		[`@media (min-width: ${CREATE_BREAKPOINT}px)`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
			display: 'none !important',
		},
	},
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&&': {
		marginInlineStart: token('space.150', '12px'),
	},
});

type TooltipSwitchProps = {
	buttonTooltip?: React.ReactNode;
	children: React.ReactNode;
};

const TooltipSwitch = ({ buttonTooltip, children }: TooltipSwitchProps) =>
	buttonTooltip ? (
		<Tooltip content={buttonTooltip} hideTooltipOnClick>
			{children}
		</Tooltip>
	) : (
		<Fragment>{children}</Fragment>
	);

/**
 * _Create__
 *
 * A call to action button that can be passed into `AtlassianNavigation`'s
 * `renderCreate` prop. It is shown after all other primary buttons.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#create)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
export const Create = ({
	onClick,
	href,
	text,
	buttonTooltip,
	iconButtonTooltip,
	testId,
	label,
}: CreateProps) => {
	const theme = useTheme();

	return (
		<div css={wrapperStyles} role="listitem" data-testid="create-button-wrapper">
			<TooltipSwitch buttonTooltip={buttonTooltip}>
				<Button
					id="createGlobalItem"
					aria-label={label}
					onClick={onClick}
					href={href}
					// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
					theme={getCreateButtonTheme(theme)}
					testId={testId && `${testId}-button`}
					data-hide-on-smallscreens
				>
					{text}
				</Button>
			</TooltipSwitch>

			<IconButton
				id="createGlobalItemIconButton"
				testId={testId && `${testId}-icon-button`}
				icon={<AddIcon label={text} />}
				onClick={onClick}
				href={href}
				tooltip={iconButtonTooltip}
				// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
				theme={getCreateButtonTheme(theme)}
				aria-label={text}
				data-hide-on-largescreens
			/>
		</div>
	);
};

export default Create;
