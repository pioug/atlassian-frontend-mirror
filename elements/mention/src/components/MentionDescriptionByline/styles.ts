import styled from '@emotion/styled';
import { N100 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const DescriptionBylineStyle = styled.span({
	color: token('color.text.subtlest', N100),
	fontSize: '12px',
	marginTop: token('space.025', '2px'),
	display: 'block',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});
