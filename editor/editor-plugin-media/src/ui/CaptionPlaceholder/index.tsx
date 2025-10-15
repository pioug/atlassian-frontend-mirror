/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { FormattedMessage, useIntl } from 'react-intl-next';

import { captionMessages as messages } from '@atlaskit/editor-common/media';
import { CAPTION_PLACEHOLDER_ID } from '@atlaskit/editor-common/media-single';
import { fg } from '@atlaskit/platform-feature-flags';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Pressable, Text, xcss } from '@atlaskit/primitives';
import { N200 } from '@atlaskit/theme/colors';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const placeholder = css`
	color: ${token('color.text.subtlest', N200)};
	width: 100%;
	text-align: center;
	margin-top: ${token('space.100', '8px')} !important;
	display: block;
`;

const placeholderText = css({
	color: token('color.text.subtlest'),
});

const placeholderButton = xcss({
	width: '100%',
	marginTop: 'space.100',
});

type CaptionPlaceholderProps = {
	onClick: () => void;
	placeholderMessage?: { defaultMessage: string; description: string; id: string };
};

// platform_editor_typography_ugc clean up
// Remove this component
export const CaptionPlaceholder = React.forwardRef<HTMLSpanElement, CaptionPlaceholderProps>(
	({ onClick, placeholderMessage }, ref) => {
		const handlePointerDown = useCallback(
			(e: React.MouseEvent) => {
				e.preventDefault();
				onClick();
			},
			[onClick],
		);

		const computedPlaceholderMessage = placeholderMessage
			? placeholderMessage
			: messages.placeholder;

		// This issue is a temporary fix for users being able to edit captions on edge browsers. This will be removed
		// replaced with CaptionPlaceholderButton in the near future and this code can be removed.
		return (
			// eslint-disable-next-line @atlaskit/design-system/use-primitives-text
			<span
				ref={ref}
				css={placeholder}
				onPointerDown={handlePointerDown}
				// This id is just used for setting styles at the moment, if it's needed for anything more specific
				// It may need to be generated to avoid overlap
				id={
					expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
					fg('platform_editor_content_mode_button_mvp')
						? CAPTION_PLACEHOLDER_ID
						: undefined
				}
				data-id={CAPTION_PLACEHOLDER_ID}
				data-testid="caption-placeholder"
			>
				<FormattedMessage
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...computedPlaceholderMessage}
				/>
			</span>
		);
	},
);

export const CaptionPlaceholderButton = React.forwardRef<
	HTMLButtonElement,
	CaptionPlaceholderProps
>(({ onClick, placeholderMessage }, ref) => {
	const intl = useIntl();
	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		// In firefox, button is focused when mouse down, which make editor lose focus
		// Hence we want to disabled it so that user can type in caption directly after click
		e.preventDefault();
	}, []);

	const computedPlaceholderMessage = placeholderMessage ? placeholderMessage : messages.placeholder;

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
			{expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
			fg('platform_editor_content_mode_button_mvp') ? (
				// This id is just used for setting styles at the moment, if it's needed for anything more specific
				// It may need to be generated to avoid overlap
				// eslint-disable-next-line @atlaskit/design-system/use-primitives-text
				<span css={placeholderText} id={CAPTION_PLACEHOLDER_ID}>
					<FormattedMessage
						// Ignored via go/ees005
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...computedPlaceholderMessage}
					/>
				</span>
			) : (
				<Text color="color.text.subtlest" size="large">
					{intl.formatMessage(computedPlaceholderMessage)}
				</Text>
			)}
		</Pressable>
	);
});
