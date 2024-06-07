import styled from '@emotion/styled';

import { N50A, N60A } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

const themedBoxShadow = token(
	'elevation.shadow.overlay',
	`0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`,
);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const CardWrapper = styled.div({
	display: 'inline-block',
	borderRadius: `${borderRadius()}px`,
	boxShadow: themedBoxShadow,
});
