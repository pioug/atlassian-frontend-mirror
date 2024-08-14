// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from 'styled-components';
import { themed } from '@atlaskit/theme';
import { P50, P500, N20, DN50, G50, G500, G100 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled -- Ignored via go/DSP-18766
const Type = styled.span`
	background-color: ${themed({ light: P50, dark: P500 })};
	border-radius: ${token('border.radius', '3px')};
	color: ${themed({ light: P500, dark: P50 })};
	display: inline-block;
	margin: 2px 0;
	padding: 0 0.2em;
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled -- Ignored via go/DSP-18766
export const TypeMeta = styled(Type)`
	background-color: ${themed({ light: N20, dark: DN50 })};
	color: ${token('color.text.subtle', '#44546F')};
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled -- Ignored via go/DSP-18766
export const StringType = styled(Type)`
	background-color: ${themed({ light: G50, dark: G500 })};
	color: ${themed({ light: G500, dark: G100 })};
`;

export default Type;
