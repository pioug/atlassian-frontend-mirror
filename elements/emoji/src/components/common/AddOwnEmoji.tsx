/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { Fragment, useCallback, type MouseEvent } from 'react';

import { css, cssMap, jsx } from '@compiled/react';
import { FormattedMessage, type WrappedComponentProps } from 'react-intl';

import AkButton from '@atlaskit/button/standard-button';
import AddIcon from '@atlaskit/icon/core/add';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { messages } from '../i18n';
import { type Props as EmojiActionsProps, uploadEmojiTestId } from './EmojiActions';
import { isRefreshEmojiPickerEnabled } from './isRefreshEmojiPickerEnabled';
import { emojiPickerAddEmoji } from './styles';

const styles = cssMap({
	icon: { marginLeft: token('space.negative.050'), marginRight: token('space.negative.025') },
});

const addCustomEmoji = css({
	alignSelf: 'center',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginLeft: '10px',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginBottom: '10px',
});

const addCustomEmojiButton = css({
	maxWidth: '285px',
});

type AddOwnEmojiProps = EmojiActionsProps & WrappedComponentProps;

export const AddOwnEmoji = (props: AddOwnEmojiProps): JSX.Element => {
	const { onOpenUpload, uploadEnabled } = props;
	const handleOpenUpload = useCallback(
		(event: MouseEvent<HTMLElement>) => {
			if (fg('platform_emoji_keep_picker_open_on_upload') || isRefreshEmojiPickerEnabled()) {
				event.preventDefault();
				event.stopPropagation();
			}
			onOpenUpload();
		},
		[onOpenUpload],
	);

	return (
		<Fragment>
			{uploadEnabled && (
				<div css={addCustomEmoji} data-testid={uploadEmojiTestId}>
					<FormattedMessage {...messages.addCustomEmojiLabel}>
						{(label) => (
							<AkButton
								onClick={handleOpenUpload}
								iconBefore={
									<Box xcss={styles.icon}>
										<AddIcon color="currentColor" label="" />
									</Box>
								}
								appearance="subtle"
								// TODO: (from codemod) Buttons with "component", "css" or "style" prop can't be automatically migrated with codemods. Please migrate it manually.
								// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides
								css={addCustomEmojiButton}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/design-system/no-unsafe-style-overrides -- Ignored via go/DSP-18766
								className={emojiPickerAddEmoji}
								tabIndex={0}
								id="add-custom-emoji"
							>
								{label}
							</AkButton>
						)}
					</FormattedMessage>
				</div>
			)}
		</Fragment>
	);
};
