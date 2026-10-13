import React from 'react';

import EmojiPlaceholder from '@atlaskit/emoji/emoji-placeholder';

export default function EmojiPlaceholderPreview(): React.JSX.Element {
	return (
		<div data-testid="component-preview">
			<EmojiPlaceholder shortName=":custom-logo:" loading />
		</div>
	);
}
