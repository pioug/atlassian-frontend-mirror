import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { visuallyHiddenRadioStyles, selectedShadow, focusedShadow } from '../styles';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const predefinedAvatarsWrapperStyles = css`
	display: flex;

	input {
		${visuallyHiddenRadioStyles}
	}

	input:checked + img {
		${selectedShadow}
	}

	input:focus + img {
		${focusedShadow}
	}

	.show-more-button {
		width: 40px;
		height: 40px;
		border-radius: ${token('border.radius.circle', '50%')};

		align-items: center;
		justify-content: center;

		margin: 0;
		padding: 0;
	}
`;
