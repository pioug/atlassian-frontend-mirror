// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from 'styled-components';
import { themed } from '@atlaskit/theme';
import { R300, R500 } from '@atlaskit/theme/colors';

// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled -- Ignored via go/DSP-18766
const Required = styled.span`
	color: ${themed({ light: R500, dark: R300 })};
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export default Required;
