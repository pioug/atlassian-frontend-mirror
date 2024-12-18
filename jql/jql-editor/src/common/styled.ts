// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const hiddenMixin = css({
	clip: 'rect(1px, 1px, 1px, 1px)',
	clipPath: 'inset(50%)',
	height: '1px',
	width: '1px',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space -- needs manual remediation
	margin: '-1px',
	overflow: 'hidden',
	padding: 0,
	position: 'absolute',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const TooltipContent = styled.div({
	fontFamily: token('font.family.body'),
});
