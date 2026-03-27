// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled, { type StyledComponent } from '@emotion/styled';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import type { Theme } from '@emotion/react';
import { token } from '@atlaskit/tokens';

import {
	mentionListWidth,
	noDialogContainerBorderColor,
	noDialogContainerBorderRadius,
	noDialogContainerBoxShadow,
} from '../../shared-styles';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface MentionPickerStyleProps {
	visible?: boolean | string;
}

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const MentionPickerStyle: StyledComponent<
	{
		theme?: Theme;
		as?: React.ElementType;
	} & MentionPickerStyleProps,
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
> = styled.div<MentionPickerStyleProps>((props) => ({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	display: props.visible ? 'block' : 'none',
}));

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const MentionPickerInfoStyle: StyledComponent<
	{
		theme?: Theme;
		as?: React.ElementType;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
> = styled.div({
	background: token('elevation.surface'),
	color: token('color.text.subtlest'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	border: `1px solid ${noDialogContainerBorderColor}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: noDialogContainerBorderRadius,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	boxShadow: noDialogContainerBoxShadow,
	display: 'block',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: mentionListWidth,
	whiteSpace: 'nowrap',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		p: {
			margin: 0,
			overflow: 'hidden',
			padding: token('space.100'),
			textOverflow: 'ellipsis',
		},
	},
});
