import React from 'react';
import { mount } from 'enzyme';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  panel,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { clickAreaClickHandler } from '../../../../ui/Addon/click-area-helper';
import { EditorView } from 'prosemirror-view';
import {
  GapCursorSelection,
  Side,
} from '../../../../plugins/selection/gap-cursor-selection';
import * as utils from '../../../../utils/dom';
import * as commands from '../../../../commands';
import * as actions from '../../../../../src/plugins/selection/gap-cursor/actions';

describe('Editor click area handler', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: { allowPanel: true },
    });

  const DummyComponent = (props: any) => (
    <div onClick={props.handleClick}>
      <div className="ak-editor-content-area">
        <div className="child-ak-editor-content-area"></div>
      </div>
      <div className="outside-ak-editor-content-area"></div>
    </div>
  );

  let wrapper: any;
  let editorView: EditorView<any>;
  beforeEach(() => {
    editorView = editor(doc(p('Hello world'))).editorView;

    wrapper = mount(
      <DummyComponent
        handleClick={(event: React.MouseEvent<any>) =>
          clickAreaClickHandler(editorView, event)
        }
      />,
    );
  });
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });
  describe('for append paragraph', () => {
    it('should call view.focus when an empty paragraph is created', () => {
      editorView = editor(doc(p('Hello world'))).editorView;
      const focusSpy = jest.spyOn(editorView, 'focus');
      wrapper
        .find('.ak-editor-content-area')
        .simulate('click', { clientY: 10 });
      expect(editorView.state.doc).toEqualDocument(
        doc(p('Hello world'), p('')),
      );
      expect(focusSpy).toHaveBeenCalled();
    });

    describe('when editor has focus true', () => {
      let addParagraphAtEndMock: any;
      let setSelectionTopLevelBlockMock: any;

      beforeEach(() => {
        const hasFocusSpy = jest.spyOn(editorView, 'hasFocus');
        hasFocusSpy.mockReturnValue(true);
        addParagraphAtEndMock = jest.spyOn(commands, 'addParagraphAtEnd');
        addParagraphAtEndMock.mockImplementation(() => {});
        setSelectionTopLevelBlockMock = jest.spyOn(
          actions,
          'setSelectionTopLevelBlocks',
        );
        setSelectionTopLevelBlockMock.mockImplementation(() => {});
      });
      it('should append paragraph after last node, when clicked outside ak-editor-content-area', () => {
        wrapper
          .find('.outside-ak-editor-content-area')
          .simulate('click', { clientY: 10 });
        expect(addParagraphAtEndMock).toHaveBeenCalledTimes(1);
        expect(setSelectionTopLevelBlockMock).toHaveBeenCalledTimes(1);
      });

      it('should append paragraph after last node, when clicked on ak-editor-content-area', () => {
        wrapper
          .find('.ak-editor-content-area')
          .simulate('click', { clientY: 10 });
        expect(addParagraphAtEndMock).toHaveBeenCalledTimes(1);
        expect(setSelectionTopLevelBlockMock).toHaveBeenCalledTimes(1);
      });

      it('should not append paragraph after last node, when clicked on children of ak-editor-content-area', () => {
        wrapper
          .find('.child-ak-editor-content-area')
          .simulate('click', { clientY: 10 });
        expect(addParagraphAtEndMock).not.toHaveBeenCalled();
        expect(setSelectionTopLevelBlockMock).not.toHaveBeenCalled();
      });

      it('should not append paragraph after last node, when clicked at a height less that editor', () => {
        addParagraphAtEndMock.mockReturnValue(false);
        wrapper
          .find('.ak-editor-content-area')
          .simulate('click', { clientY: 0 });
        expect(addParagraphAtEndMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('for gap cursor', () => {
    it('should set a Gap cursor when clicked on to a side(left/right) of a node', () => {
      editorView = editor(doc(panel()(p('{<>}')))).editorView;
      wrapper.find('.ak-editor-content-area').simulate('click', {
        // Note: editorView.dom.getBoundingClientRect() gives incorrect result in tests: { bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0 }
        // that's why writing tests for clicks on the right/left side of the content-area is not possible
        clientY: -10,
      });
      const selection = editorView.state.selection as GapCursorSelection;
      expect(selection instanceof GapCursorSelection).toBe(true);
      expect(selection.side).toEqual(Side.LEFT);
    });

    it('should call view.focus when a Gapcursor is set', () => {
      editorView = editor(doc(panel()(p('{<>}')))).editorView;
      const focusSpy = jest.spyOn(editorView, 'focus');
      wrapper
        .find('.ak-editor-content-area')
        .simulate('click', { clientY: -10 });
      const selection = editorView.state.selection as GapCursorSelection;
      expect(selection instanceof GapCursorSelection).toBe(true);
      expect(selection.side).toEqual(Side.LEFT);
      expect(focusSpy).toHaveBeenCalled();
    });
  });

  // @see ED-5126
  it('should not set a GapCursor and not append a paragraph node when a Popup is clicked', () => {
    editorView = editor(doc(p('Hello world'))).editorView;
    const closestElementSpy = jest.spyOn(utils, 'closestElement');
    (closestElementSpy as any).mockReturnValue({});
    wrapper.find('.ak-editor-content-area').simulate('click', { clientY: 10 });
    const selection = editorView.state.selection as GapCursorSelection;
    expect(selection instanceof GapCursorSelection).toBe(false);
    expect(editorView.state.doc).toEqualDocument(doc(p('Hello world')));
  });
});
