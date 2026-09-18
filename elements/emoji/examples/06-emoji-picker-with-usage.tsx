import React from 'react';

import { IntlProvider } from 'react-intl';

import {
	UsageShowAndClearComponent,
	type UsagingShowingProps,
} from '../example-helpers/demo-emoji-usage-components';
import { EmojiResource } from '../src/api/EmojiResource';
import { EmojiPicker } from '../src/picker';
import type { EmojiProvider } from '../src/resource';

const config = {
	providers: [{ url: 'https://api-private.stg.atlassian.com/emoji/standard' }],
};

class UsageShowingEmojiPickerTextInput extends UsageShowAndClearComponent {
	constructor(props: UsagingShowingProps) {
		super(props);
	}

	getWrappedComponent() {
		const { emojiResource } = this.props;
		return (
			<EmojiPicker
				onSelection={this.onSelection}
				emojiProvider={Promise.resolve(emojiResource as EmojiProvider)}
			/>
		);
	}
}

export default function Example(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<UsageShowingEmojiPickerTextInput emojiResource={new EmojiResource(config)} />
		</IntlProvider>
	);
}
