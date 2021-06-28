import React from 'react';
import { FabricChannel } from '@atlaskit/analytics-listeners';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { mentionResourceProviderWithInviteFromMentionExperiment } from '@atlaskit/util-data-test/mention-story-data';
import { default as FullPageExample } from './5-full-page';

export default function Example() {
  return (
    <AnalyticsListener
      channel={FabricChannel.atlaskit}
      onEvent={(evt) => console.log('atlaskit channel', evt)}
    >
      <FullPageExample
        mentionProvider={Promise.resolve(
          mentionResourceProviderWithInviteFromMentionExperiment,
        )}
        UNSAFE_useAnalyticsContext={true}
      />
    </AnalyticsListener>
  );
}
