/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { memo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const iconWrapperStyles = css({
	maxWidth: token('space.500', '40px'),
	maxHeight: token('space.500', '40px'),

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/design-system/no-nested-styles
	div: {
		maxWidth: token('space.500', '40px'),
		maxHeight: token('space.500', '40px'),
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/design-system/no-nested-styles
	span: {
		maxWidth: token('space.500', '40px'),
		maxHeight: token('space.500', '40px'),
	},
});

export const IconRenderer = memo(({ children }: { children: React.ReactNode }) => {
	return <div css={[iconWrapperStyles]}>{children}</div>;
});
