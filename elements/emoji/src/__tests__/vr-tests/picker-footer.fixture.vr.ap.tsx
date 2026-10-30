import React from 'react';

import { IntlProvider } from 'react-intl';

import { UNSAFE_overrideExperiment } from '@atlaskit/platform-feature-experiments/dev-override';

import EmojiPickerFooter from '../../components/picker/EmojiPickerFooter';
import type { EmojiDescription } from '../../types';

const emojiImage = `data:image/svg+xml,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="#F5CD47"/></svg>',
)}`;

const FooterPreviews = ({ emailSearch }: { emailSearch: boolean }): React.JSX.Element => {
	UNSAFE_overrideExperiment('platform_editor_mentions_email_search', { isEnabled: emailSearch });
	UNSAFE_overrideExperiment('platform_teamoji_26_refresh_emoji_picker', { isEnabled: false });
	UNSAFE_overrideExperiment('platform_teamoji_26_refresh_emoji_picker_canvas', {
		isEnabled: false,
	});

	return (
		<IntlProvider locale="en">
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Match the emoji picker width for VR. */}
			<div style={{ width: 350 }}>
				{['Smiling face', 'A custom emoji with a long name that should truncate', undefined].map(
					(name, index) => {
						const emoji: EmojiDescription = {
							id: `footer-emoji-${index}`,
							name,
							shortName: [':smile:', ':custom-long-name:', ':custom:'][index],
							type: 'STANDARD',
							category: 'PEOPLE',
							searchable: true,
							representation: { imagePath: emojiImage, width: 32, height: 32 },
						};
						return (
							<EmojiPickerFooter
								key={emoji.id}
								selectedEmoji={emoji}
								onOpenUpload={() => {}}
								uploadEnabled={false}
							/>
						);
					},
				)}
			</div>
		</IntlProvider>
	);
};

export const SpacedEmojiPickerFooters = (): React.JSX.Element => <FooterPreviews emailSearch />;
export const OriginalEmojiPickerFooters = (): React.JSX.Element => (
	<FooterPreviews emailSearch={false} />
);
