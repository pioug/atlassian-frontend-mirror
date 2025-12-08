import React from 'react';

import type { ReactHookFactory } from '@atlaskit/editor-common/types';
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
	pluginHooks: ReactHookFactory[] | undefined;
}

export function MountPluginHooks({
	pluginHooks,
	editorView,
	containerElement,
}: MountPluginHooksProps): React.JSX.Element | null {
	if (!editorView) {
		return null;
	}

	return (
		<>
			{pluginHooks?.map((usePluginHook, key) => (
				<MountPluginHook
					// Ignored via go/ees005
					// eslint-disable-next-line react/no-array-index-key
					key={key}
					usePluginHook={usePluginHook}
					editorView={editorView}
					containerElement={containerElement}
				/>
			))}
		</>
	);
}
