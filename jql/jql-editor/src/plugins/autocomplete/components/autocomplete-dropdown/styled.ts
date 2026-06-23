// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import type {
	ComponentPropsWithoutRef,
	DetailedHTMLProps,
	ForwardRefExoticComponent,
	HTMLAttributes,
	RefAttributes,
} from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import type { Theme } from '@emotion/react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled, { type StyledComponent } from '@emotion/styled';

import { componentWithFG } from '@atlaskit/platform-feature-flags-react';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const AutocompleteContainer: StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	} & {
		isOpen: boolean;
		usePopper?: boolean;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
> =
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
	styled.div<{
		isOpen: boolean;
		usePopper?: boolean;
	}>(
		{
			position: 'absolute',
			backgroundColor: token('elevation.surface.overlay'),
			borderRadius: token('radius.small', '3px'),
			willChange: 'top, left',
			zIndex: layers.dialog(),
			boxShadow: token('elevation.shadow.overlay'),
			padding: `${token('space.075')} ${token('space.0')}`,
			minWidth: '200px',
			maxWidth: '400px',
			'&:focus': {
				outline: 'none',
			},
			marginLeft: token('space.negative.100'),
			marginTop: token('space.200'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		({ isOpen }) => (isOpen ? { visibility: 'visible' } : { visibility: 'hidden' }),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		({ usePopper }) =>
			usePopper && {
				marginTop: token('space.100'),
			},
	);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const AutocompleteOptionsContainer: StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
> =
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
	styled.div({
		maxHeight: '288px',
		overflow: 'auto',
	});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const AutocompleteSectionTitle: StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>,
	{}
> =
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
	styled.h4({
		borderBottom: `solid ${token('border.width')} ${token('color.border')}`,
		color: token('color.text'),
		margin: token('space.0'),
		marginBottom: token('space.050'),
		padding: `${token('space.100')}`,
	});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const OptionListLi: StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>,
	{}
> =
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
	styled.ul({
		listStyle: 'none',
		margin: `${token('space.0')}`,
		padding: `${token('space.0')}`,
	});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const OptionListDiv: StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
> =
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
	styled.div({
		margin: `${token('space.0')}`,
		padding: `${token('space.0')}`,
	});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export type OptionListComponent = ForwardRefExoticComponent<
	ComponentPropsWithoutRef<typeof OptionListDiv> & RefAttributes<HTMLDivElement | HTMLUListElement>
>;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const OptionList: OptionListComponent = componentWithFG(
	'enable-jql-membersof-autocomplete',
	OptionListDiv,
	OptionListLi,
) as OptionListComponent;
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const AutocompleteLoadingFooter: StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	} & {
		hasOptions: boolean;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
> =
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
	styled.div<{ hasOptions: boolean }>(
		{
			display: 'flex',
			justifyContent: 'center',
			color: token('color.text.subtlest'),
			fontStyle: 'italic',
			padding: token('space.150'),
			textAlign: 'center',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
		({ hasOptions }) =>
			hasOptions && {
				borderTop: `solid ${token('border.width')} ${token('color.border')}`,
				marginTop: token('space.075'),
				paddingTop: token('space.250'),
			},
	);
