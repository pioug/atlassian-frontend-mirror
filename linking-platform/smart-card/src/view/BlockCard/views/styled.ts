import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';

// TODO: Replace overrides with proper AtlasKit solution.
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const LozengeBlockWrapper = styled.span({
	'& > span': {
		marginLeft: token('space.050', '4px'),
	},
});
