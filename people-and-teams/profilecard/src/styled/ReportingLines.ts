// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ReportingLinesSection = styled.div({
	// Minor left margin to align better with existing icon fields
	marginLeft: token('space.050', '4px'),
	marginTop: token('space.100', '8px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ManagerSection = styled.div({
	display: 'flex',
	alignItems: 'center',
	margin: `${token('space.050', '4px')} ${token('space.050', '4px')}`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ManagerName = styled.span({
	font: token('font.body.small'),
	marginLeft: token('space.100', '8px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const OffsetWrapper = styled.div({
	marginTop: token('space.050', '4px'),
	// Offset left margin so the avatar aligns with the heading
	marginLeft: token('space.negative.050', '-4px'),
});
