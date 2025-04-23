import React from 'react';
import { Text } from '@atlaskit/primitives/compiled';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import {
	mentions as mentionsData,
	mentionSampleAvatarUrl,
	mentionResourceProvider,
	mentionSlowResourceProvider,
} from '@atlaskit/util-data-test/mention-story-data';

import {
	type MentionDescription,
	type OnMentionEvent,
	type MentionEventHandler,
} from '../src/types';
import debug from '../src/util/logger';

// eslint-disable-next-line import/no-extraneous-dependencies
export { MockPresenceResource } from '@atlaskit/util-data-test/mock-presence-resource';
// eslint-disable-next-line import/no-extraneous-dependencies
export { mentions } from '@atlaskit/util-data-test/mention-story-data';

export const resourceProvider = mentionResourceProvider;
export const slowResourceProvider = mentionSlowResourceProvider;
export const sampleAvatarUrl = mentionSampleAvatarUrl;

export const generateMentionItem = (component: JSX.Element, description?: string) => (
	<div>
		<Text as="p">{description}</Text>
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<ul style={{ padding: 0 }}>{component}</ul>
	</div>
);

export const randomMentions = () => mentionsData.filter(() => Math.random() < 0.7);

export const onSelection: OnMentionEvent = (mention: MentionDescription) =>
	debug('onSelection ', mention);

export const onMentionEvent: MentionEventHandler = (
	mentionId: string,
	text: string,
	e?: React.SyntheticEvent<HTMLSpanElement>,
) => debug(mentionId, text, e ? e.type : '');
