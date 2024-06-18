// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { MediaSingleDimensionHelper } from '@atlaskit/editor-common/ui';
import type { MediaSingleDimensionHelperProps } from '@atlaskit/editor-common/ui';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Needs manual remediation
export const wrapperStyle = (props: MediaSingleDimensionHelperProps) => css`
	& > div {
		${MediaSingleDimensionHelper(props)};
		position: relative;
		clear: both;
	}
`;
