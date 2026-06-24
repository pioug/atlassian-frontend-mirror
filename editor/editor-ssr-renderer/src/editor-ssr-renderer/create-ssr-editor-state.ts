import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { EditorState } from '@atlaskit/editor-prosemirror/state';

/**
 * Creates an EditorState for SSR from pre-built SSR-safe PM plugins.
 * Callers are responsible for building pmPlugins via createSSRPMPlugins first.
 */
export function createSSREditorState({
	pmPlugins,
	schema,
	doc,
}: {
	doc: PMNode | undefined;
	pmPlugins: SafePlugin[];
	schema: Schema;
}): EditorState {
	return EditorState.create({
		doc,
		schema,
		plugins: pmPlugins,
	});
}
