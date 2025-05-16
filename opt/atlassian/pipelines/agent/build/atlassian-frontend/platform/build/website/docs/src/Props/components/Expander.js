// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from 'styled-components';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
const Expander = styled.span({
	cursor: 'pointer',
	padding: token('space.050'),
	borderRadius: token('border.radius'),
	background: token('color.background.accent.gray.subtlest'),
	color: token('color.text'),
	transition: 'background 0.2s',
	'&:hover': {
		background: token('color.background.accent.gray.subtlest.hovered'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export default Expander;
