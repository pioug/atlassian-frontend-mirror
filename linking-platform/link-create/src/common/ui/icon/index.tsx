import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import Document16Icon from '@atlaskit/icon-file-type/glyph/document/16';
import { N20A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/prefer-primitives, @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const UrlIcon = styled.div<{ url?: string }>((props) => ({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundImage: `url(${props.url ?? ''})`,
	backgroundColor: token('color.skeleton', N20A),
	backgroundSize: 'contain',
	backgroundRepeat: 'no-repeat',
	height: token('space.200', '16px'),
	width: token('space.200', '16px'),
	borderRadius: token('border.radius', '3px'),
	flexShrink: 0,
}));

export const PageIcon = () => <Document16Icon label="Page" />;
