import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorPlugin } from '@atlaskit/editor-common/types/editor-plugin';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

function createEscapeTakerPlugin(takeEscape: () => boolean): EditorPlugin {
	return {
		name: 'escapeTaker',
		pmPlugins: () => [
			{ name: 'escapeTaker', plugin: () => keymap({ Escape: takeEscape }) as SafePlugin },
		],
	};
}

/**
 * ProseMirror cancels a keydown with `keyCode` 27 (`captureKeyDown`), as a real Escape press has.
 * Without the `keyCode`, the event would skip that check and the test would prove nothing.
 */
function pressEscape({
	editorPlugins,
	isComposing = false,
}: { editorPlugins?: EditorPlugin[]; isComposing?: boolean } = {}): KeyboardEvent {
	const createEditor = createEditorFactory();
	const { editorView } = createEditor({ doc: doc(p('text{<>}')), editorPlugins });
	if (isComposing) {
		Object.defineProperty(editorView, 'composing', { value: true });
	}
	const event = new KeyboardEvent('keydown', {
		key: 'Escape',
		code: 'Escape',
		bubbles: true,
		cancelable: true,
	});
	Object.defineProperty(event, 'keyCode', { value: 27 });
	editorView.dom.dispatchEvent(event);
	return event;
}

describe('Escape keydown in the editor', () => {
	describe('on the top-layer path', () => {
		beforeEach(() => passGate('platform-dst-top-layer'));

		it('does not cancel an Escape that no keymap takes, so a layer around the editor can close', () => {
			expect(pressEscape().defaultPrevented).toBe(false);
		});

		it('cancels an Escape that a keymap takes', () => {
			const editorPlugins = [createEscapeTakerPlugin(() => true)];

			expect(pressEscape({ editorPlugins }).defaultPrevented).toBe(true);
		});

		it('leaves an Escape during a composition to ProseMirror, which runs no keymap', () => {
			const takeEscape = jest.fn(() => true);
			const editorPlugins = [createEscapeTakerPlugin(takeEscape)];

			expect(pressEscape({ editorPlugins, isComposing: true }).defaultPrevented).toBe(false);
			expect(takeEscape).not.toHaveBeenCalled();
		});
	});

	describe('on the legacy path', () => {
		beforeEach(() => failGate('platform-dst-top-layer'));

		it('cancels every Escape, as before', () => {
			expect(pressEscape().defaultPrevented).toBe(true);
		});

		it('cancels an Escape that a keymap takes, as before', () => {
			const editorPlugins = [createEscapeTakerPlugin(() => true)];

			expect(pressEscape({ editorPlugins }).defaultPrevented).toBe(true);
		});
	});
});
