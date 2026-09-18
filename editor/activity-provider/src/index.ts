// Disable no-re-export for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

import ActivityResource from './api/ActivityResource';
import { ActivityError } from './api/error';
import type { ActivityProvider, ActivityItem } from './types';

export { ActivityResource, ActivityError };
export type { ActivityProvider, ActivityItem };
