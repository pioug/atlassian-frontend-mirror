/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment } from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { FormattedMessage, type WrappedComponentProps } from 'react-intl';
import { messages } from '../i18n';
import Button from '@atlaskit/button/new';

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

	return (
		<Fragment>
			{uploadEnabled && (
				<div css={addCustomEmoji} data-testid={uploadEmojiTestId}>
					<FormattedMessage {...messages.addEmojiLabel}>
						{(label) => (
							<Button onClick={onOpenUpload} tabIndex={0} id="add-custom-emoji">
								{label}
							</Button>
						)}
					</FormattedMessage>
				</div>
			)}
		</Fragment>
	);
};
