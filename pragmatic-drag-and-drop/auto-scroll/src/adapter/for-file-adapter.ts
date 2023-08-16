import { monitorForFiles } from '@atlaskit/pragmatic-drag-and-drop/adapter/file';

import { makeApi } from '../make-api';

const api = makeApi({ monitor: monitorForFiles });

export const autoScrollForFiles = api.autoScroll;
export const autoScrollWindowForFiles = api.autoScrollWindow;
