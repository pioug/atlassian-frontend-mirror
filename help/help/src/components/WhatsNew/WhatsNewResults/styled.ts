/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const WhatsNewResultsContainer = styled.div({
	position: 'absolute',
	height: '100%',
	width: '100%',
	top: 0,
	backgroundColor: token('elevation.surface', '#FFFFFF'),
	flex: 1,
	flexDirection: 'column',
	boxSizing: 'border-box',
	overflowX: 'hidden',
	overflowY: 'auto',
	zIndex: 1,
	padding: token('space.200', '16px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const SelectContainer = styled.div({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: `${19 * gridSize()}px`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const WhatsNewResultsListContainer = styled.div({
	paddingTop: token('space.100', '8px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const WhatsNewResultsListTitleContainer = styled.div({
	padding: `0 ${token('space.100', '8px')}`,
});
