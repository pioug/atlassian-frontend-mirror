import React, { useEffect } from 'react';

import type { NamedReactHookFactory, ReactHookFactory } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { render } from '@atlassian/testing-library';

import { MountPluginHooks } from '../../../ui/PluginSlot/mount-plugin-hooks';

const editorView = {} as EditorView;
const containerElement = document.createElement('div');

/**
 * Builds a hook factory whose mounted MountPluginHook fiber is observable
 * via a per-plugin mount counter. A bumped counter on rerender means the
 * fiber for that plugin was re-created (i.e. lost its key).
 */
const makeCountingHook = (counters: Record<string, number>, name: string): NamedReactHookFactory => {
	counters[name] = 0;
	const useCountingHook: NamedReactHookFactory = () => {
		useEffect(() => {
			counters[name] += 1;
		}, []);
	};
	useCountingHook.pluginName = name;
	return useCountingHook;
};

describe('MountPluginHooks', () => {
	it('keys each fiber by `pluginName` so reordering does not remount surviving hooks', () => {
		const counters: Record<string, number> = {};
		const hookA = makeCountingHook(counters, 'a');
		const hookB = makeCountingHook(counters, 'b');

		const { rerender } = render(
			<MountPluginHooks
				editorView={editorView}
				containerElement={containerElement}
				pluginHooks={[hookA]}
			/>,
		);
		expect(counters).toEqual({ a: 1, b: 0 });

		// 'b' is prepended, shifting 'a' from index 0 to index 1. With a
		// stable per-name key, 'a' keeps its fiber and does NOT remount.
		rerender(
			<MountPluginHooks
				editorView={editorView}
				containerElement={containerElement}
				pluginHooks={[hookB, hookA]}
			/>,
		);
		expect(counters).toEqual({ a: 1, b: 1 });
	});

	it('unmounts a plugin hook that is removed from the list', () => {
		const cleanups: Record<string, number> = { a: 0, b: 0 };
		const trackingHook = (name: string): NamedReactHookFactory => {
			const useTrackingHook: NamedReactHookFactory = () => {
				useEffect(() => {
					return () => {
						cleanups[name] += 1;
					};
				}, []);
			};
			useTrackingHook.pluginName = name;
			return useTrackingHook;
		};

		const hookA = trackingHook('a');
		const hookB = trackingHook('b');

		const { rerender } = render(
			<MountPluginHooks
				editorView={editorView}
				containerElement={containerElement}
				pluginHooks={[hookA, hookB]}
			/>,
		);
		expect(cleanups).toEqual({ a: 0, b: 0 });

		rerender(
			<MountPluginHooks
				editorView={editorView}
				containerElement={containerElement}
				pluginHooks={[hookB]}
			/>,
		);
		expect(cleanups).toEqual({ a: 1, b: 0 });
	});

	it('falls back to array index for hooks without a pluginName annotation', () => {
		// Bare `ReactHookFactory` values (no `pluginName` set) get the
		// pre-Option-B index-keyed behavior: reordering them remounts
		// surviving hooks because the keys shift.
		const counters: Record<string, number> = {};
		const bareHookA: ReactHookFactory = makeCountingHook(counters, 'a');
		// Strip the annotation so we exercise the fallback path.
		delete (bareHookA as NamedReactHookFactory).pluginName;
		const bareHookB: ReactHookFactory = makeCountingHook(counters, 'b');
		delete (bareHookB as NamedReactHookFactory).pluginName;

		const { rerender } = render(
			<MountPluginHooks
				editorView={editorView}
				containerElement={containerElement}
				pluginHooks={[bareHookA]}
			/>,
		);
		expect(counters).toEqual({ a: 1, b: 0 });

		// Without a pluginName, key is the index. Prepending shifts hookA
		// off its fiber and remounts it under the new index.
		rerender(
			<MountPluginHooks
				editorView={editorView}
				containerElement={containerElement}
				pluginHooks={[bareHookB, bareHookA]}
			/>,
		);
		expect(counters.a).toBe(2);
	});

	it('renders nothing when editorView is undefined', async () => {
		const { container } = render(
			<MountPluginHooks
				editorView={undefined}
				containerElement={containerElement}
				pluginHooks={[() => undefined]}
			/>,
		);
		expect(container.firstChild).toBeNull();

		await expect(document.body).toBeAccessible();
	});
});
