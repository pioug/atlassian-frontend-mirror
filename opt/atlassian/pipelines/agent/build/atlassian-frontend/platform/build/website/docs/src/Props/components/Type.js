// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from 'styled-components';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled -- Ignored via go/DSP-18766
const Type = styled.span`
	background-color: ${token('color.background.accent.purple.subtlest')};
	border-radius: ${token('border.radius', '3px')};
	color: ${token('color.text.accent.purple')};
	display: inline-block;
	margin: 2px 0;
	padding: 0 0.2em;
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled -- Ignored via go/DSP-18766
export const TypeMeta = styled(Type)`
	background-color: ${token('color.background.neutral')};
	color: ${token('color.text.subtle')};
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled -- Ignored via go/DSP-18766
export const StringType = styled(Type)`
	background-color: ${token('color.background.accent.green.subtlest')};
	color: ${token('color.text.accent.green')};
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-styled
export const FunctionType = styled.span({
	background: token('color.background.accent.teal.subtlest'),
	color: token('color.text.accent.teal'),
	borderRadius: token('border.radius'),
	padding: '0 0.2em',
	fontFamily: 'monospace',
});

export default Type;
