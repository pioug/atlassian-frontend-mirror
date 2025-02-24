/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { fg } from '@atlaskit/platform-feature-flags';
import { tickBoxClassName } from './styles';
import { type TickBoxProps } from './types';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { transition } from '../styles';
import { B200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const getSelectedStyles = (selected?: boolean) =>
	selected
		? `background-color: ${token('color.icon.information', B200)};
      color: ${token('color.icon.inverse', 'white')};`
		: ``;

const oldWrapperStyes = css({
	width: '14px',
	height: '14px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	span: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		svg: {
			height: '14px',
		},
	},
});

const wrapperStyles = (selected?: boolean) =>
	css(
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		transition && transition(),
		{
			font: token('font.body'),
			width: token('space.200'),
			height: token('space.200'),
			position: 'absolute',
			top: token('space.075', '7px'),
			left: token('space.075', '7px'),
			borderRadius: token('space.250'),
			color: 'transparent',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			span: {
				display: 'block',
			},
			display: 'grid',
			placeItems: 'center',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		getSelectedStyles(selected),
	);

wrapperStyles.displayName = 'TickBoxWrapper';

export const TickBoxWrapper = (props: TickBoxProps) => {
	return (
		<div
			id="tickBoxWrapper"
			css={[
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				wrapperStyles(props.selected),
				!fg('platform-visual-refresh-icons') && oldWrapperStyes,
			]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={tickBoxClassName}
		>
			{props.children}
		</div>
	);
};
