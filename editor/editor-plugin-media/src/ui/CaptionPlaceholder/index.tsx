/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { captionMessages as messages } from '@atlaskit/editor-common/media';
import { CAPTION_PLACEHOLDER_ID } from '@atlaskit/editor-common/media-single';
import { Pressable, Text, xcss } from '@atlaskit/primitives';
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

const placeholderButton = xcss({
	width: '100%',
	marginTop: 'space.100',
});

// platform_editor_typography_migration_ugc clean up
// Remove this component
export const CaptionPlaceholder = React.forwardRef<HTMLSpanElement, { onClick: () => void }>(
	({ onClick }, ref) => {
		return (
			// eslint-disable-next-line @atlaskit/design-system/use-primitives-text
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
	},
);

export const CaptionPlaceholderButton = React.forwardRef<
	HTMLButtonElement,
	{ onClick: () => void }
>(({ onClick }, ref) => {
	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		// In firefox, button is focused when mouse down, which make editor lose focus
		// Hence we want to disabled it so that user can type in caption directly after click
		e.preventDefault();
	}, []);

	return (
		<Pressable
			ref={ref}
			backgroundColor="color.background.neutral.subtle"
			onClick={onClick}
			onMouseDown={handleMouseDown}
			data-id={CAPTION_PLACEHOLDER_ID}
			testId="caption-placeholder"
			padding="space.0"
			xcss={placeholderButton}
		>
			<Text color="color.text.subtlest" size="large">
				<FormattedMessage {...messages.placeholder} />
			</Text>
		</Pressable>
	);
});
