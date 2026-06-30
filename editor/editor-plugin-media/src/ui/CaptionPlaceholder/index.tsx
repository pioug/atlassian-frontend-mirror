/* eslint-disable @atlaskit/design-system/use-primitives-text */
// This had to be disabled to add an id and styles to a component that could not be replaced with Text
// This was added in a experiment cleanup and should be removed if possible
// Be sure to use primitives in this file as needed
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl';

import { captionMessages as messages } from '@atlaskit/editor-common/media';
import { CAPTION_PLACEHOLDER_ID } from '@atlaskit/editor-common/media-single';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Pressable, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const placeholder = css`
	color: ${token('color.text.subtlest')};
	width: 100%;
	text-align: center;
	margin-top: ${token('space.100')} !important;
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
export const CaptionPlaceholder: React.ForwardRefExoticComponent<
	CaptionPlaceholderProps & React.RefAttributes<HTMLSpanElement>
> = React.forwardRef<HTMLSpanElement, CaptionPlaceholderProps>(
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
				id={CAPTION_PLACEHOLDER_ID}
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

export const CaptionPlaceholderButton: React.ForwardRefExoticComponent<
	CaptionPlaceholderProps & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef<HTMLButtonElement, CaptionPlaceholderProps>(
	({ onClick, placeholderMessage }, ref) => {
		const handleMouseDown = useCallback((e: React.MouseEvent) => {
			// In firefox, button is focused when mouse down, which make editor lose focus
			// Hence we want to disabled it so that user can type in caption directly after click
			e.preventDefault();
		}, []);

		const computedPlaceholderMessage = placeholderMessage
			? placeholderMessage
			: messages.placeholder;

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
				{/* This id is just used for setting styles at the moment, if it's needed for anything more
				specific. It may need to be generated to avoid overlap*/}
				<span css={placeholderText} id={CAPTION_PLACEHOLDER_ID}>
					<FormattedMessage
						// Ignored via go/ees005
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...computedPlaceholderMessage}
					/>
				</span>
			</Pressable>
		);
	},
);
