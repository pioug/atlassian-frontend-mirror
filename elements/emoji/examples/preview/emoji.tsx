import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import Emoji from '@atlaskit/emoji/emoji';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: 'fit-content',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});

export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<Emoji
					renderUnicodeEmojiAsImage={false}
					fitToHeight={56}
					emoji={{
						id: 'smile',
						shortName: ':smile:',
						type: 'STANDARD',
						category: 'PEOPLE',
						searchable: true,
						representation: { unicodeEmoji: '😄' },
					}}
				/>
				<Emoji
					renderUnicodeEmojiAsImage={false}
					fitToHeight={56}
					emoji={{
						id: 'celebrate',
						shortName: ':tada:',
						type: 'STANDARD',
						category: 'ACTIVITY',
						searchable: true,
						representation: { unicodeEmoji: '🎉' },
					}}
				/>
				<Emoji
					renderUnicodeEmojiAsImage={false}
					fitToHeight={56}
					emoji={{
						id: 'heart',
						shortName: ':heart:',
						type: 'STANDARD',
						category: 'SYMBOLS',
						searchable: true,
						representation: { unicodeEmoji: '❤️' },
					}}
				/>
			</Box>
		</IntlProvider>
	);
}
