import React from 'react';
import {
  mentions as mentionsData,
  mentionSampleAvatarUrl,
  mentionResourceProvider,
  mentionSlowResourceProvider,
} from '@atlaskit/util-data-test/mention-story-data';

import {
  MentionDescription,
  OnMentionEvent,
  MentionEventHandler,
} from '../src/types';
import debug from '../src/util/logger';

export { MockPresenceResource } from '@atlaskit/util-data-test/mock-presence-resource';
export { mentions } from '@atlaskit/util-data-test/mention-story-data';

export const resourceProvider = mentionResourceProvider;
export const slowResourceProvider = mentionSlowResourceProvider;
export const sampleAvatarUrl = mentionSampleAvatarUrl;

export const generateMentionItem = (
  component: JSX.Element,
  description?: string,
) => (
  <div>
    <p>{description}</p>
    <ul style={{ padding: 0 }}>{component}</ul>
  </div>
);

export const randomMentions = () =>
  mentionsData.filter(() => Math.random() < 0.7);

export const onSelection: OnMentionEvent = (mention: MentionDescription) =>
  debug('onSelection ', mention);

export const onMentionEvent: MentionEventHandler = (
  mentionId: string,
  text: string,
  e?: React.SyntheticEvent<HTMLSpanElement>,
) => debug(mentionId, text, e ? e.type : '');
