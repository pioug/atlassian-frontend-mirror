// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';
import { borderRadius } from '@atlaskit/theme/constants';
import { scrollableMaxHeight } from '../../shared-styles';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ScrollableStyle = styled.div({
	display: 'block',
	overflowX: 'hidden',
	overflowY: 'auto',
	padding: `${token('space.050', '4px')} 0`,
	margin: 0,
	background: token('elevation.surface', 'white'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	maxHeight: scrollableMaxHeight,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: `${borderRadius()}px`,
});
