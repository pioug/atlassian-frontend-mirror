import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import type { EmojiProvider } from '@atlaskit/emoji/types';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';

import { Reaction } from '../../src/components/Reaction';
const styles = cssMap({
	subject: {
		width: 'fit-content',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});
export const previewOptions = { width: 'fit-content', scale: 1.8 } as const;
export default function Preview(): React.JSX.Element {
	return (
		<Box testId="component-preview" xcss={styles.subject}>
			<IntlProvider locale="en">
				{['1f604', '1f389', '2764'].map((emojiId, index) => (
					<Reaction
						key={emojiId}
						emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
						reaction={{
							ari: 'reaction',
							containerAri: 'project',
							emojiId,
							count: [4, 2, 3][index],
							reacted: index === 0,
						}}
						onClick={() => {}}
					/>
				))}
			</IntlProvider>
		</Box>
	);
}
