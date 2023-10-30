import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/adapter/element';

import { makeApi } from '../over-element/make-api';

const api = makeApi({ monitor: monitorForElements });

export const autoScrollForElements = api.autoScroll;
export const autoScrollWindowForElements = api.autoScrollWindow;
