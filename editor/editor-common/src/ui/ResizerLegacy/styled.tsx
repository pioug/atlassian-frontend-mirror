/* eslint-disable @atlaskit/ui-styling-standard/use-compiled -- Pre-existing lint debt surfaced by this mechanical type-import-only PR. */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import { MediaSingleDimensionHelper } from '../MediaSingle/styled';
import type { MediaSingleWrapperProps as MediaSingleDimensionHelperProps } from '../MediaSingle/styled';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Needs manual remediation
export const wrapperStyle = (props: MediaSingleDimensionHelperProps): SerializedStyles => css`
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
