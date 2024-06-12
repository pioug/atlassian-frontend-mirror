import styled from '@emotion/styled';

import { N50A, N60A } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

const themedBoxShadow = token(
	'elevation.shadow.overlay',
	`0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`,
);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const CardWrapper = styled.div({
	display: 'inline-block',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: `${borderRadius()}px`,
	boxShadow: themedBoxShadow,
});
