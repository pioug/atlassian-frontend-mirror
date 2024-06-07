import styled from 'styled-components';
import { N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ResultItemGroupHeader = styled.div({
	display: 'flex',
	marginLeft: token('space.negative.150', '-12px'),
	marginTop: token('space.150', '12px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ResultItemGroupTitle = styled.div({
	fontSize: '11px',
	lineHeight: '16px',
	fontWeight: 600,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ResultItemAfter = styled.div<{ shouldTakeSpace: boolean }>((props) => ({
	minWidth: props.shouldTakeSpace ? '24px' : 0,
}));

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ResultItemAfterWrapper = styled.div({
	display: 'flex',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ResultItemCaption = styled.span({
	color: N200,
	fontSize: '12px',
	marginLeft: token('space.100', '8px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ResultItemSubText = styled.span({
	fontSize: '12px',
	color: N200,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ResultItemIcon = styled.div({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexShrink: 0,
	transition: 'padding 200ms',
	'> *': {
		flex: '1 0 auto',
	},

	/* We need to ensure that any image passed in as a child (<img/>, <svg/>
    etc.) receives the correct width, height and border radius. We don't
    currently assume that the image passed in is the correct dimensions, or has
    width / height 100% */
	'> img': {
		height: token('space.300', '24px'),
		width: token('space.300', '24px'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ResultItemTextAfter = styled.div({
	position: 'relative',
	zIndex: 1,
});
