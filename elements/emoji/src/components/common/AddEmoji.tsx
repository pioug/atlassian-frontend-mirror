/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useCallback, type MouseEvent } from 'react';

import { css, jsx } from '@compiled/react';
import { FormattedMessage, type WrappedComponentProps } from 'react-intl';

import Button from '@atlaskit/button/default/button';
import { token } from '@atlaskit/tokens';

import { messages } from '../i18n';

export const emojiActionsTestId = 'emoji-actions';
export const uploadEmojiTestId = 'upload-emoji';

const addCustomEmoji = css({
	alignSelf: 'center',
	marginTop: token('space.150'),
	marginRight: token('space.150'),
	marginBottom: token('space.150'),
	marginLeft: token('space.150'),
});

type Props = {
	onOpenUpload: () => void;
	uploadEnabled: boolean;
};

// Generic Type for the wrapped functional component
type PropsWithWrappedComponentPropsType = Props & WrappedComponentProps;

type AddOwnEmojiProps = PropsWithWrappedComponentPropsType;
export const AddOwnEmoji = (props: AddOwnEmojiProps): JSX.Element => {
	const { onOpenUpload, uploadEnabled } = props;
	const handleOpenUpload = useCallback(
		(event: MouseEvent<HTMLElement>) => {
			event.preventDefault();
			event.stopPropagation();
			onOpenUpload();
		},
		[onOpenUpload],
	);

	return (
		<Fragment>
			{uploadEnabled && (
				<div css={addCustomEmoji} data-testid={uploadEmojiTestId}>
					<FormattedMessage {...messages.addEmojiLabel}>
						{(label) => (
							<Button onClick={handleOpenUpload} tabIndex={0} id="add-custom-emoji">
								{label}
							</Button>
						)}
					</FormattedMessage>
				</div>
			)}
		</Fragment>
	);
};
