import { token } from '@atlaskit/tokens';
import styled from '@emotion/styled';
import { N200 } from '@atlaskit/theme/colors';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const NoLinkAppearance = styled.span({
	color: token('color.text.subtlest', N200),
});
