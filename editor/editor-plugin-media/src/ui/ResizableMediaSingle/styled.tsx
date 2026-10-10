// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import { MediaSingleDimensionHelper } from '@atlaskit/editor-common/MediaSingle/styled';
import type { MediaSingleWrapperProps as MediaSingleDimensionHelperProps } from '@atlaskit/editor-common/MediaSingle/styled';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Needs manual remediation
export const wrapperStyle = (props: MediaSingleDimensionHelperProps): SerializedStyles => css`
	& > div {
		${MediaSingleDimensionHelper(props)};
		position: relative;
		clear: both;
	}
`;
