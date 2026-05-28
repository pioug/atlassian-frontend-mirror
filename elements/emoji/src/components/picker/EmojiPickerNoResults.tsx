/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, type MouseEvent } from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { fg } from '@atlaskit/platform-feature-flags';
import { FormattedMessage } from 'react-intl';
import AkButton from '@atlaskit/button/standard-button';
import Image from '@atlaskit/image';
import { messages } from '../i18n';
import SearchNoResultDark from './assets/spot/search-no-result/dark.svg';
import SearchNoResultLight from './assets/spot/search-no-result/light.svg';

const noResultsContainer = css({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	paddingTop: token('space.300'),
	paddingRight: token('space.200'),
	paddingBottom: token('space.300'),
	paddingLeft: token('space.200'),
	gap: token('space.200'),
	textAlign: 'center',
	width: '100%',
	boxSizing: 'border-box',
});

export const RENDER_EMOJI_PICKER_NO_RESULTS_TESTID = 'render-emoji-picker-no-results';

export interface Props {
	onOpenUpload: () => void;
	uploadEnabled: boolean;
}

const EmojiPickerNoResults = ({ onOpenUpload, uploadEnabled }: Props): JSX.Element => {
	const handleOpenUpload = useCallback(
		(event: MouseEvent<HTMLElement>) => {
			if (fg('platform_emoji_keep_picker_open_on_upload')) {
				event.preventDefault();
				event.stopPropagation();
			}
			onOpenUpload();
		},
		[onOpenUpload],
	);

	return (
		<div css={noResultsContainer} data-testid={RENDER_EMOJI_PICKER_NO_RESULTS_TESTID}>
			<Image src={SearchNoResultLight} srcDark={SearchNoResultDark} alt="" width={200} />
			{uploadEnabled && (
				<FormattedMessage {...messages.emojiPickerAddCustomEmoji}>
					{(label) => (
						<AkButton onClick={handleOpenUpload} appearance="default" tabIndex={0}>
							{label}
						</AkButton>
					)}
				</FormattedMessage>
			)}
		</div>
	);
};

export default EmojiPickerNoResults;
