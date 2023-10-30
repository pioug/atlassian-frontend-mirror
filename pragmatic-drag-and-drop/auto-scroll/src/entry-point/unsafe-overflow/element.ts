import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/adapter/element';

import { makeApi } from '../../unsafe-overflow/make-api';

const api = makeApi({ monitor: monitorForElements });

export const unsafeOverflowAutoScrollForElements = api.unsafeOverflowAutoScroll;
