import React from 'react';

import type { NamedReactHookFactory, ReactHookFactory } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

type HookParameters = Parameters<ReactHookFactory>[0];

interface MountPluginHookProps extends HookParameters {
	usePluginHook: ReactHookFactory;
}

function MountPluginHook({ usePluginHook, editorView, containerElement }: MountPluginHookProps) {
	usePluginHook({ editorView, containerElement });
	return null;
}

interface MountPluginHooksProps {
	containerElement: HTMLElement | null;
	editorView: EditorView | undefined;
	pluginHooks: NamedReactHookFactory[] | undefined;
}

export function MountPluginHooks({
	pluginHooks,
	editorView,
	containerElement,
}: MountPluginHooksProps): React.JSX.Element | null {
	if (!editorView) {
		return null;
	}

	// Key each fiber by the plugin name carried on the hook function (set by
	// `processPluginsList`). This keeps fibers stable across `reconfigureState`
	// calls that change the plugin set — keying by array index would let React
	// reuse the same fiber for a different `usePluginHook`, which calls a
	// different sequence of hooks (Rules of Hooks violation).
	// Falls back to the array index for any hook that wasn't annotated.
	return (
		<>
			{pluginHooks?.map((usePluginHook, index) => {
				const pluginName = usePluginHook.pluginName;
				return (
					<MountPluginHook
						// eslint-disable-next-line react/no-array-index-key
						key={pluginName ?? index}
						usePluginHook={usePluginHook}
						editorView={editorView}
						containerElement={containerElement}
					/>
				);
			})}
		</>
	);
}
