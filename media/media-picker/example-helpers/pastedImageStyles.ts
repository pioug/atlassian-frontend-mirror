import { css, type SerializedStyles } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import type { PastedImageStyleType } from './PastedImage';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
export const pastedImageStyles = (style: PastedImageStyleType): SerializedStyles => css`
	width: ${style.width ? `${style.width}px` : '100%'};
	${style.height ? `height: ${style.height}px` : ''};
`;
