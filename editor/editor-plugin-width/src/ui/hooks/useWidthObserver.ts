import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { conditionalHooksFactory } from '@atlaskit/platform-feature-flags-react/conditional-hooks-factory/conditional-hooks-factory';

import { useResizeWidthObserver } from './useResizeWidthObserver';
import { useResizeWidthObserverNext } from './useResizeWidthObserverNext';

/**
 * Selects the width observer implementation for the lifetime of the editor.
 *
 * `conditionalHooksFactory` calls the condition on every render so each one is recorded as an
 * exposure, while caching the first result so hook order stays stable. Only the selected hook
 * runs.
 *
 * On cleanup, delete this file plus `useResizeWidthObserver` and `useRefreshOnTransition` (which
 * holds the duplicate `setEditorWidth`), and point `usePluginHook` at `useResizeWidthObserverNext`.
 */
export const useWidthObserver: (props: {
	containerElement: HTMLElement | null;
	editorView: EditorView;
}) => void = conditionalHooksFactory(
	() => isExperimentEnabled('platform_editor_reduce_forced_layout'),
	useResizeWidthObserverNext,
	useResizeWidthObserver,
);
