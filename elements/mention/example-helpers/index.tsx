import React from 'react';
import { mention, MockMentionResource } from '@atlaskit/util-data-test';
import {
  MentionDescription,
  OnMentionEvent,
  MentionEventHandler,
} from '../src/types';
import debug from '../src/util/logger';
export { MockPresenceResource } from '@atlaskit/util-data-test';

export const resourceProvider: MockMentionResource =
  mention.storyData.resourceProvider;
export const slowResourceProvider: MockMentionResource =
  mention.storyData.slowResourceProvider;

export const generateMentionItem = (
  component: JSX.Element,
  description?: string,
) => (
  <div>
    <p>{description}</p>
    <ul style={{ padding: 0 }}>{component}</ul>
  </div>
);

export const { mentions, sampleAvatarUrl } = mention.storyData;
export const randomMentions = () => mentions.filter(() => Math.random() < 0.7);

export const onSelection: OnMentionEvent = (mention: MentionDescription) =>
  debug('onSelection ', mention);

export const onMentionEvent: MentionEventHandler = (
  mentionId: string,
  text: string,
  e?: React.SyntheticEvent<HTMLSpanElement>,
) => debug(mentionId, text, e ? e.type : '');
