import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { fontFamily } from '@atlaskit/theme/constants';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
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

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const TooltipContent = styled.div({
	fontFamily: fontFamily(),
});
