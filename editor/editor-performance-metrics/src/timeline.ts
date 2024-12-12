/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import {
	createTimelineFromEvents,
	type ElementChangedEvent,
	type Timeline,
	type TimelineEvent,
	type TimelineSerializable,
} from './internals/timeline';

export { createTimelineFromEvents };

export type { Timeline, TimelineEvent, TimelineSerializable, ElementChangedEvent };
