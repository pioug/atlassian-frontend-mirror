import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const InputWrapper = styled.div({
	margin: `${token('space.250')} 0`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const PreviewList = styled.ul({
	margin: 0,
	padding: 0,
	listStyleType: 'none',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const PreviewItem = styled.li({
	borderRadius: token('space.100'),
	border: `${token('border.width', '1px')} solid ${token('color.border')}`,
	padding: token('space.100'),
	overflow: 'auto',
	maxHeight: '600px',
	position: 'relative',
	marginBottom: token('space.100'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Code = styled.code({
	padding: token('space.050'),
	borderRadius: token('space.050'),
	backgroundColor: token('color.background.inverse.subtle'),
	color: token('color.text'),
	font: token('font.code'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const CloseButton = styled.button({
	position: 'absolute',
	top: token('space.050'),
	right: token('space.050'),
	cursor: 'pointer',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const PreviewImageContainer = styled.div({
	marginTop: token('space.100'),
	marginBottom: token('space.100'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const OrientationSelectWrapper = styled.label({
	marginBottom: token('space.250'),
	display: 'block',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const TimeRangeWrapper = styled.div({
	marginTop: token('space.500'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Container = styled.div({
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Group = styled.div({
	width: '250px',
	padding: token('space.250'),
});
