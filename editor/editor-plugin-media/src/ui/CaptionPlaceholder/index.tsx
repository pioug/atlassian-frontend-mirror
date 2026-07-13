/* eslint-disable @atlaskit/design-system/use-primitives-text */
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
