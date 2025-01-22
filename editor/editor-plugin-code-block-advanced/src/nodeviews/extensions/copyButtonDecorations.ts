import { RangeSetBuilder } from '@codemirror/state';
import { EditorView as CodeMirror, Decoration } from '@codemirror/view';

export const copyButtonDecorations = CodeMirror.decorations.compute([], (state) => {
	const allTextDecoration = Decoration.mark({
		attributes: { class: 'ProseMirror-fake-text-selection' },
	});
	// Create a set of decorations for the entire document
	const builder = new RangeSetBuilder<Decoration>();
	for (let i = 0; i < state.doc.lines; i++) {
		builder.add(state.doc.line(i + 1).from, state.doc.line(i + 1).to, allTextDecoration);
	}
	const decorations = builder.finish();
	return decorations;
});
