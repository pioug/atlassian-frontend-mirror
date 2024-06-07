import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';

// TODO: Figure out a more scalable/responsive solution
// for vertical alignment.
// Current rationale: vertically positioned at the top of
// the smart card container (when set to 0). Offset this
// to position it with appropriate whitespace from the top.
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const Icon = styled.img({
	height: '14px',
	width: '14px',
	marginRight: token('space.050', '4px'),
	borderRadius: '2px',
	userSelect: 'none',
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
});

// Used for 'untrue' icons which claim to be 16x16 but
// are less than that in height/width.
// TODO: Replace this override with proper AtlasKit solution.
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const AKIconWrapper = styled.span({
	marginRight: token('space.negative.025', '-2px'),
});
