import { monitorForFiles } from '@atlaskit/pragmatic-drag-and-drop/adapter/file';

import { makeApi } from '../../unsafe-overflow/make-api';

const api = makeApi({ monitor: monitorForFiles });

export const unsafeOverflowAutoScrollForFiles = api.unsafeOverflowAutoScroll;
