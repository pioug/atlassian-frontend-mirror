import { DocBuilder } from '@atlaskit/editor-common/types';
import { EditorState, Transaction, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { Step } from '@atlaskit/editor-prosemirror/transform';
import { EditorView } from '@atlaskit/editor-prosemirror/view';
import { defaultSchema as schema } from '@atlaskit/editor-test-helpers/schema';
import {
	collab,
	sendableSteps,
	receiveTransaction,
	getCollabState,
} from '@atlaskit/prosemirror-collab';
import type { ConflictChanges } from '@atlaskit/editor-common/collab';

const positionExists = (position: number | undefined): boolean => typeof position === 'number';

export class Editor {
	private view: EditorView;

	constructor(docBuilder: DocBuilder | undefined = undefined) {
		const doc = docBuilder?.(schema);

		const state = EditorState.create({
			doc,
			schema,
			plugins: [collab({})],
		});
		this.view = new EditorView(null, {
			state,
		});

		const refs = doc?.refs;
		const tr = this.view.state.tr;

		if (refs) {
			// Collapsed selection.
			if (positionExists(refs['<>'])) {
				tr.setSelection(TextSelection.create(tr.doc, refs['<>']));
				this.view.dispatch(tr);
				// Expanded selection
			} else if (positionExists(refs['<']) || positionExists(refs['>'])) {
				if (!positionExists(refs['<'])) {
					throw new Error('A `<` ref must complement a `>` ref.');
				}
				if (!positionExists(refs['>'])) {
					throw new Error('A `>` ref must complement a `<` ref.');
				}
				tr.setSelection(TextSelection.create(tr.doc, refs['<'], refs['>']));
				this.view.dispatch(tr);
			}
		}
	}

	setSelection(pos: number) {
		const tr = this.view.state.tr.setSelection(TextSelection.create(this.view.state.doc, pos));
		this.sync(tr);
		return this;
	}

	insert(text: string) {
		const tr = this.view.state.tr.insertText(text);
		this.sync(tr);
		return this;
	}

	insertEmoji() {
		const {
			tr,
			schema,
			selection: { from },
		} = this.view.state;
		const emoji = schema.nodes.emoji.createChecked({
			shortName: ':man_facepalming:',
			text: '🤦‍♂️',
		});
		if (emoji) {
			tr.insert(from, emoji);
		}
		this.sync(tr);
		return this;
	}

	insertAsChars(text: string) {
		for (const char of text) {
			this.insert(char);
		}
		return this;
	}

	delete({ repeat }: { repeat: number } = { repeat: 1 }) {
		for (let i = 0; i <= repeat; i++) {
			const { tr, selection } = this.view.state;
			this.sync(tr.delete(selection.from - 1, selection.from));
		}
		return this;
	}

	rebaseWithRemoteSteps(remoteSteps: readonly Step[] | undefined) {
		if (remoteSteps) {
			this.sync(receiveTransaction(this.view.state, remoteSteps, []));
		}
	}

	private sync(tr: Transaction) {
		this.view.dispatch(tr);
	}

	getSteps(): readonly Step[] | undefined {
		return sendableSteps(this.view.state)?.steps;
	}

	getUnconfirmed() {
		// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
		return getCollabState(this.view.state)?.unconfirmed!;
	}

	getDoc() {
		return this.view.state.doc;
	}

	getTr() {
		return this.view.state.tr;
	}

	applyDeleted(deleted: ConflictChanges['deleted'][number]) {
		const tr = this.view.state.tr.replace(deleted.from, deleted.from, deleted.local);
		return tr.doc;
	}
	applyInserted(inserted: ConflictChanges['inserted'][number]) {
		const tr = this.view.state.tr.replace(inserted.from, inserted.to, inserted.local);
		return tr.doc;
	}
}
