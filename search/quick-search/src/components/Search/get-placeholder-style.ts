// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type InterpolationValue } from 'styled-components';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
export const getPlaceholderStyle = (style: any): InterpolationValue[] => css`
	&::-webkit-input-placeholder {
		${style};
	}
	&::-moz-placeholder {
		/* Mozilla Firefox 19+ */
		${style} opacity: 1;
	}
	&::-ms-input-placeholder {
		/* Microsoft Edge */
		${style};
	}
	&:-moz-placeholder {
		/* Mozilla Firefox 4 to 18 */
		${style} opacity: 1;
	}
	&:-ms-input-placeholder {
		/* Internet Explorer 10-11 */
		${style};
	}
`;
