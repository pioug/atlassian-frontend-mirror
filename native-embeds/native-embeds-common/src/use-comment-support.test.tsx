import React from 'react';

import { act, renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';

import { noNativeEmbedCommentSupport } from './comment-support';
import * as storeModule from './comment-support-store';
import { useNativeEmbedCommentSupport } from './use-comment-support';

afterEach(() => jest.restoreAllMocks());

it('refreshes mounted consumers after delayed registration and unsubscribes on unmount', () => {
	const store = new storeModule.NativeEmbedCommentSupportStore();
	jest.spyOn(storeModule, 'getNativeEmbedCommentSupportStore').mockReturnValue(store);
	const unsubscribe = jest.fn();
	const subscribe = store.subscribe;
	jest.spyOn(store, 'subscribe').mockImplementation((listener) => {
		const dispose = subscribe(listener);
		return () => {
			unsubscribe();
			dispose();
		};
	});
	const first = renderHook(useNativeEmbedCommentSupport);
	const second = renderHook(useNativeEmbedCommentSupport);
	expect(first.result.current).toBe(noNativeEmbedCommentSupport);
	act(() => store.register('maui', true));
	expect(first.result.current).toBe(store.getSnapshot());
	expect(second.result.current).toBe(first.result.current);
	first.unmount();
	second.unmount();
	expect(unsubscribe).toHaveBeenCalledTimes(2);
});

it('reads capabilities registered before mounting and preserves the predicate on rerender', () => {
	const store = new storeModule.NativeEmbedCommentSupportStore();
	store.register('maui', true);
	jest.spyOn(storeModule, 'getNativeEmbedCommentSupportStore').mockReturnValue(store);
	const { result, rerender } = renderHook(useNativeEmbedCommentSupport);
	expect(result.current).toBe(store.getSnapshot());
	const ready = result.current;
	rerender();
	expect(result.current).toBe(ready);
});

it('uses disabled support during server rendering even when manifests are registered', () => {
	const store = new storeModule.NativeEmbedCommentSupportStore();
	store.register('maui', true);
	jest.spyOn(storeModule, 'getNativeEmbedCommentSupportStore').mockReturnValue(store);
	const subscribe = jest.spyOn(store, 'subscribe');
	const Probe = () => {
		const supports = useNativeEmbedCommentSupport();
		return <span>{supports === noNativeEmbedCommentSupport ? 'disabled' : 'enabled'}</span>;
	};
	expect(renderToString(<Probe />)).toBe('<span>disabled</span>');
	expect(subscribe).not.toHaveBeenCalled();
});
