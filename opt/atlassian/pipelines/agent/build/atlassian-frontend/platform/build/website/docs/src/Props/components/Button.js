// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from 'styled-components';
import Button from '@atlaskit/button';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
const StyledButton = styled(Button)({
	background: token('color.background.accent.purple.subtlest'),
	color: token('color.text.accent.purple'),
	borderRadius: token('border.radius'),
	'&:hover': {
		background: token('color.background.accent.purple.subtlest.hovered'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export default StyledButton;
