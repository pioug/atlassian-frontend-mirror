import { token } from '@atlaskit/tokens';
import { N900 } from '@atlaskit/theme/colors';
import styled from '@emotion/styled';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const InputWrapper = styled.div({
	margin: `${token('space.250', '20px')} 0`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const PreviewList = styled.ul({
	margin: 0,
	padding: 0,
	listStyleType: 'none',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const PreviewInfo = styled.pre({
	fontSize: '80%',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const PreviewItem = styled.li({
	borderRadius: token('space.100', '8px'),
	border: `1px solid ${token('color.border', '#ccc')}`,
	padding: token('space.100', '8px'),
	overflow: 'auto',
	maxHeight: '600px',
	position: 'relative',
	marginBottom: token('space.100', '8px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const Code = styled.code({
	padding: token('space.050', '4px'),
	borderRadius: token('space.050', '4px'),
	backgroundColor: token('color.background.inverse.subtle', '#0002'),
	color: token('color.text', N900),
	fontSize: '80%',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const CloseButton = styled.button({
	position: 'absolute',
	top: token('space.050', '4px'),
	right: token('space.050', '4px'),
	cursor: 'pointer',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const PreviewImageContainer = styled.div({
	marginTop: token('space.100', '8px'),
	marginBottom: token('space.100', '8px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const OrientationSelectWrapper = styled.label({
	marginBottom: token('space.250', '20px'),
	display: 'block',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const TimeRangeWrapper = styled.div({
	marginTop: token('space.500', '40px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const Container = styled.div({
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const Group = styled.div({
	width: '250px',
	padding: token('space.250', '20px'),
});
