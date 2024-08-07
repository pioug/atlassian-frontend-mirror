/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { captionMessages as messages } from '@atlaskit/editor-common/media';
import { CAPTION_PLACEHOLDER_ID } from '@atlaskit/editor-common/media-single';
import { N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const placeholder = css`
	color: ${token('color.text.subtlest', N200)};
	width: 100%;
	text-align: center;
	margin-top: ${token('space.100', '8px')} !important;
	display: block;
`;

export default React.forwardRef<HTMLSpanElement, { onClick: () => void }>(({ onClick }, ref) => {
	return (
		<span
			ref={ref}
			css={placeholder}
			onClick={onClick}
			data-id={CAPTION_PLACEHOLDER_ID}
			data-testid="caption-placeholder"
		>
			<FormattedMessage {...messages.placeholder} />
		</span>
	);
});
