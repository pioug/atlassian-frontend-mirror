// Disable no-re-export for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

import ActivityResource from './api/ActivityResource';
import { type ActivityProvider, type ActivityItem } from './types';
import { ActivityError } from './api/error';

export { ActivityResource, ActivityError };
export type { ActivityProvider, ActivityItem };
