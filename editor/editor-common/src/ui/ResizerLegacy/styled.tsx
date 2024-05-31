import { css } from '@emotion/react';

import {
	MediaSingleDimensionHelper,
	type MediaSingleWrapperProps as MediaSingleDimensionHelperProps,
} from '../MediaSingle/styled';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Needs manual remediation
export const wrapperStyle = (props: MediaSingleDimensionHelperProps) => css`
	& > div {
		${MediaSingleDimensionHelper(props)};
		position: relative;
		clear: both;

		> div {
			position: absolute;
			height: 100%;
			width: 100%;
		}
	}
`;
