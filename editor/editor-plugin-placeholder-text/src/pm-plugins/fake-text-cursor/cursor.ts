import type { Node, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { Slice } from '@atlaskit/editor-prosemirror/model';
import type {
	EditorState,
	SelectionBookmark,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { Selection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { Mappable } from '@atlaskit/editor-prosemirror/transform';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';

export class FakeTextCursorBookmark {
	pos: undefined | number = undefined;
	visible: boolean = false;

	constructor(pos: number) {
		this.pos = pos;
	}

	map(mapping: Mappable): FakeTextCursorBookmark {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return new FakeTextCursorBookmark(mapping.map(this.pos!));
	}

	resolve(doc: Node): Selection {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const $pos = doc.resolve(this.pos!);
		return Selection.near($pos);
	}
}

export class FakeTextCursorSelection extends Selection {
	constructor($pos: ResolvedPos) {
		super($pos, $pos);
	}

	map(doc: Node, mapping: Mappable): Selection {
		const $pos = doc.resolve(mapping.map(this.$head.pos));
		return new FakeTextCursorSelection($pos);
	}

	static content(): Slice {
		return Slice.empty;
	}

	eq(other: Selection): boolean {
		return other instanceof FakeTextCursorSelection && other.head === this.head;
	}

	toJSON() {
		return { type: 'Cursor', pos: this.head };
	}

	static fromJSON(doc: Node, json: { pos: number }): Selection {
		return new FakeTextCursorSelection(doc.resolve(json.pos));
	}

	getBookmark(): SelectionBookmark {
		return new FakeTextCursorBookmark(this.anchor) as SelectionBookmark;
	}
}

Selection.jsonID('fake-text-cursor', FakeTextCursorSelection);

export const addFakeTextCursor = (state: EditorState, dispatch: (tr: Transaction) => void) => {
	const { selection } = state;
	if (selection.empty) {
		const {
			selection: { $from },
		} = state;
		dispatch(state.tr.setSelection(new FakeTextCursorSelection($from)));
	}
};

export const removeFakeTextCursor = (state: EditorState, dispatch: (tr: Transaction) => void) => {
	if (state.selection instanceof FakeTextCursorSelection) {
		const { $from } = state.selection;
		dispatch(state.tr.setSelection(new TextSelection($from)));
	}
};

export const drawFakeTextCursor = (state: EditorState): DecorationSet | null => {
	if (!(state.selection instanceof FakeTextCursorSelection)) {
		return null;
	}
	const node = document.createElement('div');
	node.className = 'ProseMirror-fake-text-cursor';
	return DecorationSet.create(state.doc, [
		Decoration.widget(state.selection.head, node, { key: 'Cursor' }),
	]);
};
