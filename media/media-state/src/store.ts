import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createStore } from 'zustand/vanilla';

import { type FileState } from './file-state';

export interface Store {
	files: Record<string, FileState>;
}

const mediaStoreWithoutDevtools = createStore<Store>()(
	subscribeWithSelector(immer(() => ({ files: {} }))),
);

const mediaStoreWithDevtools = createStore<Store>()(
	devtools(subscribeWithSelector(immer(() => ({ files: {} })))),
);

export type MediaStore = typeof mediaStoreWithoutDevtools;

export const mediaStore =
	process.env.NODE_ENV === 'development' && !process.env.CI
		? (mediaStoreWithDevtools as MediaStore)
		: mediaStoreWithoutDevtools;

export const createMediaStore = (initialStore?: Store) => {
	return createStore<Store>()(subscribeWithSelector(immer(() => ({ files: {}, ...initialStore }))));
};
