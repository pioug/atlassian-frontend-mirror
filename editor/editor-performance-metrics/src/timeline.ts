/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import { createTimelineFromEvents } from './internals/timeline';
import type { Timeline, TimelineSerializable } from './internals/timelineInterfaces';
import type { ElementChangedEvent, TimelineEvent } from './internals/timelineTypes';

export { createTimelineFromEvents };

export type { Timeline, TimelineEvent, TimelineSerializable, ElementChangedEvent };
