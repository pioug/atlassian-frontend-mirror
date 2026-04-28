// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled, { css, type InterpolationValue, type StyledComponentClass } from 'styled-components';
import { token } from '@atlaskit/tokens';
import type { DetailedHTMLProps, HTMLAttributes, InputHTMLAttributes } from 'react';

// Copied from `@atlaskit/theme` to allow removal of that package
const B200 = '#2684FF';
const N0 = '#FFFFFF';
const N500 = '#42526E';
const N50 = '#C1C7D0';

const inputRightPadding = token('space.200');

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const SearchBox: StyledComponentClass<
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	any,
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
> = styled.div({
	position: 'sticky',
	top: 0,
	backgroundColor: N0,
	color: N500,
	display: 'flex',
	height: '36px',
	zIndex: 10 /* required to keep the search box on top of icons in results when sticky */,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const SearchFieldBaseOuter: StyledComponentClass<
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	any,
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
> = styled.div({
	display: 'flex',
	flex: 1,
	marginRight: 'auto',
	paddingBottom: token('space.025'),
	borderBottom: `2px solid ${B200}`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const SearchFieldBaseInner: StyledComponentClass<
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	any,
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
> = styled.div({
	position: 'relative',
	alignItems: 'center',
	paddingRight: inputRightPadding /* pad search text from FieldBase's isLoading spinner */,
	display: 'flex',
	flexGrow: 1,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const SearchInner: StyledComponentClass<
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	any,
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
> = styled.div({
	paddingRight: token('space.300'),
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
export const getPlaceholderStyle = (style: any): InterpolationValue[] => css`
	&::-webkit-input-placeholder {
		${style};
	}
	&::-moz-placeholder {
		/* Mozilla Firefox 19+ */
		${style} opacity: 1;
	}
	&::-ms-input-placeholder {
		/* Microsoft Edge */
		${style};
	}
	&:-moz-placeholder {
		/* Mozilla Firefox 4 to 18 */
		${style} opacity: 1;
	}
	&:-ms-input-placeholder {
		/* Internet Explorer 10-11 */
		${style};
	}
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const getPlaceholderColor: InterpolationValue[] = css({
	color: token('color.text.subtlest'),
});

// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const SearchInput: StyledComponentClass<
	DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
	any,
	DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
	// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
> = styled.input`
	background-color: transparent;
	border: 0;
	color: ${N500};
	flex-grow: 1;
	font-size: 1.4em;
	outline: 0;
	/* Safari adds 2px margin-left */
	margin-left: 0;
	${getPlaceholderStyle(getPlaceholderColor)};
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const SearchInputTypeAhead: StyledComponentClass<
	DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
	any,
	DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
> = styled(SearchInput)({
	color: N50,
	position: 'absolute',
	width: `calc(100% - ${inputRightPadding})`,
	zIndex: -1,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const SearchInputControlsContainer: StyledComponentClass<
	DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
	any,
	DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
> = styled.span({
	paddingLeft: token('space.300'),
});
SearchInputControlsContainer.displayName = 'SearchInputControlsContainer'; // required for testing
