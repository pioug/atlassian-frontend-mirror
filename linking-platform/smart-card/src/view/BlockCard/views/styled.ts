import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';

// TODO: Replace overrides with proper AtlasKit solution.
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const LozengeBlockWrapper = styled.span({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > span': {
		marginLeft: token('space.050', '4px'),
	},
});
