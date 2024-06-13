import styled from '@emotion/styled';

import { B400, B50, N0, N20, N30, R400 } from '@atlaskit/theme/colors';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const PopupComponentContainer = styled.div({
	boxSizing: 'border-box',
	display: 'block',
	flex: '1 1 auto',
	overflow: 'visible',
	borderRadius: token('border.radius.100', '4px'),
	background: token('color.background.input', N0),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':focus': {
		outline: 'none',
	},
	boxShadow: token(
		'elevation.shadow.overlay',
		'0px 0px 1px 0px rgba(9, 30, 66, 0.31), 0px 3px 5px 0px rgba(9, 30, 66, 0.20)',
	),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const CustomDropdown = styled.div({
	width: '340px',
	background: token('color.background.input', N0),
	borderRadius: token('border.radius.100', '4px'),
	boxShadow: token(
		'elevation.shadow.overlay',
		'0px 0px 1px 0px rgba(9, 30, 66, 0.31), 0px 3px 5px 0px rgba(9, 30, 66, 0.20)',
	),
	zIndex: layers.modal(),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const CustomDropdownItem = styled.div<{ isSelected: boolean }>((props) => ({
	height: '36px',
	width: '100%',
	display: 'flex',
	justifyContent: 'flex-start',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	paddingLeft: props.isSelected ? '15px' : '16px',
	boxSizing: 'border-box',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	color: props.isSelected ? token('color.text.selected', B400) : 'inherit',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	background: props.isSelected
		? token('color.background.accent.blue.subtlest', B50)
		: 'transparent',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderLeft: props.isSelected ? `2px solid ${token('color.text.selected', B400)}` : 'none',
	'&:hover': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		background: props.isSelected
			? token('color.background.accent.blue.subtlest', B50)
			: token('color.background.input.hovered', N20),
		cursor: 'default',
	},
}));

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const CustomDateWrapper = styled.div({
	padding: token('space.150', '12px'),
	boxSizing: 'border-box',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const DatePickersWrapper = styled.div({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	width: '100%',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const SelectDateRangeButton = styled.button({
	background: token('color.background.accent.gray.subtler', N20),
	border: 'none',
	font: 'inherit',
	width: '70px',
	height: '40px',
	marginTop: token('space.150', '12px'),
	borderRadius: token('border.radius.100', '4px'),
	'&:hover': {
		background: token('color.background.accent.gray.subtler', N30),
		cursor: 'pointer',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const DateRangeErrorMessage = styled.div({
	display: 'flex',
	lineHeight: 1.3333,
	marginTop: token('space.050', '2px'),
	fontSize: token('font.size.075', '12px'),
	color: token('color.text.danger', R400),
});
