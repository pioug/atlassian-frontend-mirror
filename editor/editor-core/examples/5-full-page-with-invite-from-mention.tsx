import React from 'react';

import { FabricChannel } from '@atlaskit/analytics-listeners';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { mentionResourceProviderWithInviteFromMentionEnabled } from '@atlaskit/util-data-test/mention-story-data';

import { default as FullPageExample } from './5-full-page';

const editorProps = {
	mentionProvider: Promise.resolve(mentionResourceProviderWithInviteFromMentionEnabled),
	UNSAFE_useAnalyticsContext: true,
};

export default function Example() {
	return (
		<AnalyticsListener
			channel={FabricChannel.atlaskit}
			onEvent={(evt) => console.log('atlaskit channel', evt)}
		>
			<FullPageExample editorProps={editorProps} />
		</AnalyticsListener>
	);
}
