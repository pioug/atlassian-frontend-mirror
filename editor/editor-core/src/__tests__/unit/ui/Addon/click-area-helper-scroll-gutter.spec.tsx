import React from 'react';

import type { DocBuilder } from '@atlaskit/editor-common/types/doc-builder';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p, panel } from '@atlaskit/editor-test-helpers/doc-builder';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { fireEvent, render } from '@atlassian/testing-library/testing-library/react';

import { clickAreaClickHandler } from '../../../../ui/Addon/click-area-helper';

const GATE = 'platform_editor_scroll_gutter_click_add_line';

const FullPageContentAreaDom = ({
	onMouseDown,
}: {
	onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
}) => (
	<div data-testid="click-wrapper" onMouseDown={onMouseDown}>
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- mirrors FullPageContentArea */}
		<div className="ak-editor-content-area-region">
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- mirrors FullPageContentArea */}
			<div className="ak-editor-content-area">
				<div data-testid="plugin-ui">Plugin UI</div>
				<div data-editor-content-component="true">
					<div data-testid="footer-content-component">Footer</div>
				</div>
				{/* Mirrors the Confluence live doc footer: a hydration wrapper around a second wrapper whose
				content is offset away, leaving the wrapper's own box blank. */}
				<div data-editor-content-component="true">
					<div data-testid="hydration-wrapper">
						<div data-editor-content-component="true" data-testid="nested-wrapper">
							<div data-testid="offset-footer">Comments</div>
						</div>
					</div>
				</div>
				<div id="editor-scroll-gutter" data-editor-scroll-gutter="true">
					<span data-testid="ui-inside-gutter">UI rendered inside the gutter</span>
				</div>
			</div>
		</div>
	</div>
);

describe('clicking the scroll gutter below the document', () => {
	const createEditor = createEditorFactory();
	let editorView: EditorView;
	let hasFocusSpy: jest.SpyInstance;

	const renderWithDoc = (document: DocBuilder, { focused }: { focused: boolean }) => {
		editorView = createEditor({ doc: document, editorProps: { allowPanel: true } }).editorView;
		hasFocusSpy = jest.spyOn(editorView, 'hasFocus').mockReturnValue(focused);
		render(
			<FullPageContentAreaDom onMouseDown={(event) => clickAreaClickHandler(editorView, event)} />,
		);
	};

	/**
	 * Mirrors the base plugin's scroll gutter: an attribute-only div appended to the ProseMirror
	 * parent (the content area), without the id the React-rendered gutter has.
	 */
	const appendBasePluginGutter = () => {
		document.querySelector('.ak-editor-content-area')!.appendChild(editorView.dom);
		const gutter = document.createElement('div');
		gutter.setAttribute('data-editor-scroll-gutter', 'true');
		editorView.dom.parentElement!.appendChild(gutter);
		return gutter;
	};

	// jsdom reports a zero-size rect for view.dom, so any positive clientY is below the document.
	const mouseDownBelowDocument = (selector: string, init: MouseEventInit = {}) =>
		fireEvent.mouseDown(document.querySelector(selector)!, { clientY: 10, ...init });
	const clickScrollGutter = (init: MouseEventInit = {}) =>
		mouseDownBelowDocument('#editor-scroll-gutter', init);

	const caretIsAtDocEnd = () =>
		editorView.state.selection.empty &&
		editorView.state.selection.from === editorView.state.doc.content.size - 1;

	afterEach(() => {
		hasFocusSpy.mockRestore();
	});

	describe('gate on', () => {
		beforeEach(() => passGate(GATE));

		it('adds a trailing paragraph and places the caret in it when the editor is focused', () => {
			renderWithDoc(doc(p('Intro'), panel()(p('Last{<>}'))), { focused: true });
			clickScrollGutter();
			expect(editorView.state.doc).toEqualDocument(doc(p('Intro'), panel()(p('Last')), p('')));
			expect(caretIsAtDocEnd()).toBe(true);
		});

		it('moves the caret into the existing empty trailing paragraph without adding another', () => {
			renderWithDoc(doc(panel()(p('Last{<>}')), p('')), { focused: true });
			clickScrollGutter();
			expect(editorView.state.doc).toEqualDocument(doc(panel()(p('Last')), p('')));
			expect(caretIsAtDocEnd()).toBe(true);
		});

		// Each case below clicks a non-gutter target first, then the gutter, which proves the gate
		// was on for the first click.
		it('still ignores focused clicks on other children of the content area', () => {
			renderWithDoc(doc(panel()(p('Last{<>}'))), { focused: true });
			mouseDownBelowDocument('[data-testid="plugin-ui"]');
			expect(editorView.state.doc).toEqualDocument(doc(panel()(p('Last'))));

			clickScrollGutter();
			expect(editorView.state.doc).toEqualDocument(doc(panel()(p('Last')), p('')));
		});

		it('still ignores clicks on UI rendered inside the gutter', () => {
			renderWithDoc(doc(panel()(p('Last{<>}'))), { focused: true });
			mouseDownBelowDocument('[data-testid="ui-inside-gutter"]');
			expect(editorView.state.doc).toEqualDocument(doc(panel()(p('Last'))));

			clickScrollGutter();
			expect(editorView.state.doc).toEqualDocument(doc(panel()(p('Last')), p('')));
		});

		it('adds a trailing paragraph from the base plugin gutter (attribute only, no id)', () => {
			renderWithDoc(doc(p('Intro'), panel()(p('Last{<>}'))), { focused: true });
			const basePluginGutter = appendBasePluginGutter();
			fireEvent.mouseDown(basePluginGutter, { clientY: 10 });
			expect(editorView.state.doc).toEqualDocument(doc(p('Intro'), panel()(p('Last')), p('')));
			expect(caretIsAtDocEnd()).toBe(true);
		});

		it('replaces a node selection with a caret in the new trailing paragraph', () => {
			renderWithDoc(doc(p('Intro'), panel()(p('Last'))), { focused: true });
			const panelPos = editorView.state.doc.child(0).nodeSize;
			editorView.dispatch(
				editorView.state.tr.setSelection(NodeSelection.create(editorView.state.doc, panelPos)),
			);
			clickScrollGutter();
			expect(editorView.state.doc).toEqualDocument(doc(p('Intro'), panel()(p('Last')), p('')));
			expect(caretIsAtDocEnd()).toBe(true);
		});

		it('replaces a non-empty text selection with a caret in the new trailing paragraph', () => {
			renderWithDoc(doc(p('{<}Intro{>}'), panel()(p('Last'))), { focused: true });
			clickScrollGutter();
			expect(editorView.state.doc).toEqualDocument(doc(p('Intro'), panel()(p('Last')), p('')));
			expect(caretIsAtDocEnd()).toBe(true);
		});

		it.each<[string, MouseEventInit]>([
			['a right click', { button: 2 }],
			['a middle click', { button: 1 }],
			['a shift+click', { shiftKey: true }],
			['a ctrl+click', { ctrlKey: true }],
			['a meta+click', { metaKey: true }],
			['an alt+click', { altKey: true }],
		])('ignores %s on the gutter', (_gesture, init) => {
			renderWithDoc(doc(p('{<}Intro{>}'), panel()(p('Last'))), { focused: true });
			const selectionBefore = editorView.state.selection.toJSON();
			clickScrollGutter(init);
			expect(editorView.state.doc).toEqualDocument(doc(p('Intro'), panel()(p('Last'))));
			expect(editorView.state.selection.toJSON()).toEqual(selectionBefore);

			clickScrollGutter();
			expect(editorView.state.doc).toEqualDocument(doc(p('Intro'), panel()(p('Last')), p('')));
		});

		describe('blank space of a content component wrapper', () => {
			const clickContentComponentWrapper = (init: MouseEventInit = {}) =>
				mouseDownBelowDocument('[data-editor-content-component]', init);

			it('adds a trailing paragraph when the wrapper itself is clicked below the document', () => {
				renderWithDoc(doc(p('Intro'), panel()(p('Last{<>}'))), { focused: true });
				clickContentComponentWrapper();
				expect(editorView.state.doc).toEqualDocument(doc(p('Intro'), panel()(p('Last')), p('')));
				expect(caretIsAtDocEnd()).toBe(true);
			});

			// Above the document the outside-click handler would place a gap cursor before the panel.
			it('ignores a wrapper click above the document', () => {
				renderWithDoc(doc(panel()(p('{<}Intro{>}')), p('Last')), { focused: true });
				const selectionBefore = editorView.state.selection.toJSON();
				clickContentComponentWrapper({ clientY: -10 });
				expect(editorView.state.doc).toEqualDocument(doc(panel()(p('Intro')), p('Last')));
				expect(editorView.state.selection.toJSON()).toEqual(selectionBefore);

				clickContentComponentWrapper();
				expect(editorView.state.doc).toEqualDocument(doc(panel()(p('Intro')), p('Last'), p('')));
			});

			it('adds a trailing paragraph from a wrapper nested in another content component', () => {
				renderWithDoc(doc(p('Intro'), panel()(p('Last{<>}'))), { focused: true });
				mouseDownBelowDocument('[data-testid="nested-wrapper"]');
				expect(editorView.state.doc).toEqualDocument(doc(p('Intro'), panel()(p('Last')), p('')));
				expect(caretIsAtDocEnd()).toBe(true);
			});

			it('adds a trailing paragraph from a nested wrapper when the editor is not focused', () => {
				renderWithDoc(doc(p('Intro'), panel()(p('Last'))), { focused: false });
				mouseDownBelowDocument('[data-testid="nested-wrapper"]');
				expect(editorView.state.doc).toEqualDocument(doc(p('Intro'), panel()(p('Last')), p('')));
				expect(caretIsAtDocEnd()).toBe(true);
			});

			it.each([
				['the content inside a nested wrapper', '[data-testid="offset-footer"]'],
				['a non-wrapper element around a nested wrapper', '[data-testid="hydration-wrapper"]'],
			])('still ignores clicks on %s', (_target, selector) => {
				renderWithDoc(doc(panel()(p('Last{<>}'))), { focused: true });
				mouseDownBelowDocument(selector);
				expect(editorView.state.doc).toEqualDocument(doc(panel()(p('Last'))));

				mouseDownBelowDocument('[data-testid="nested-wrapper"]');
				expect(editorView.state.doc).toEqualDocument(doc(panel()(p('Last')), p('')));
			});

			it('ignores a right click on the wrapper', () => {
				renderWithDoc(doc(panel()(p('Last{<>}'))), { focused: true });
				clickContentComponentWrapper({ button: 2 });
				expect(editorView.state.doc).toEqualDocument(doc(panel()(p('Last'))));

				clickContentComponentWrapper();
				expect(editorView.state.doc).toEqualDocument(doc(panel()(p('Last')), p('')));
			});
		});

		it('still ignores clicks on content components', () => {
			renderWithDoc(doc(panel()(p('Last{<>}'))), { focused: true });
			mouseDownBelowDocument('[data-testid="footer-content-component"]');
			expect(editorView.state.doc).toEqualDocument(doc(panel()(p('Last'))));

			clickScrollGutter();
			expect(editorView.state.doc).toEqualDocument(doc(panel()(p('Last')), p('')));
		});
	});

	describe('gate off', () => {
		beforeEach(() => failGate(GATE));

		it('keeps the existing behaviour: a focused editor ignores scroll gutter clicks', () => {
			renderWithDoc(doc(p('Intro'), panel()(p('Last{<>}'))), { focused: true });
			clickScrollGutter();
			expect(editorView.state.doc).toEqualDocument(doc(p('Intro'), panel()(p('Last'))));
		});

		it('keeps the existing behaviour: a focused editor ignores content component wrapper clicks', () => {
			renderWithDoc(doc(p('Intro'), panel()(p('Last{<>}'))), { focused: true });
			mouseDownBelowDocument('[data-editor-content-component]');
			expect(editorView.state.doc).toEqualDocument(doc(p('Intro'), panel()(p('Last'))));
		});

		it('does not measure the document for a content component wrapper click', () => {
			renderWithDoc(doc(p('Intro'), panel()(p('Last{<>}'))), { focused: true });
			const measureDocument = jest.spyOn(editorView.dom, 'getBoundingClientRect');
			mouseDownBelowDocument('[data-editor-content-component]');
			expect(measureDocument).not.toHaveBeenCalled();
		});

		it.each([true, false])(
			'keeps the existing behaviour: nested wrapper clicks are ignored (focused: %s)',
			(focused) => {
				renderWithDoc(doc(p('Intro'), panel()(p('Last'))), { focused });
				mouseDownBelowDocument('[data-testid="nested-wrapper"]');
				expect(editorView.state.doc).toEqualDocument(doc(p('Intro'), panel()(p('Last'))));
			},
		);
	});

	// The gate is only read for a focused editor; the unfocused path is unchanged in both states.
	it('adds a trailing paragraph when the editor is not focused', async () => {
		renderWithDoc(doc(p('Intro'), panel()(p('Last'))), { focused: false });
		clickScrollGutter();
		expect(editorView.state.doc).toEqualDocument(doc(p('Intro'), panel()(p('Last')), p('')));
		expect(caretIsAtDocEnd()).toBe(true);
		await expect(document.body).toBeAccessible();
	});
});
