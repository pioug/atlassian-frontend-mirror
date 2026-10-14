import { useSyncExternalStore } from 'react';

import { noNativeEmbedCommentSupport, type NativeEmbedCommentSupport } from './comment-support';
import { getNativeEmbedCommentSupportStore } from './comment-support-store';

const getDisabledSnapshot = () => noNativeEmbedCommentSupport;

/** Shared comment eligibility for editors and renderers; late manifest registration is reactive. */
export const useNativeEmbedCommentSupport = (): NativeEmbedCommentSupport => {
	const store = getNativeEmbedCommentSupportStore();
	return useSyncExternalStore(store.subscribe, store.getSnapshot, getDisabledSnapshot);
};
