import React from 'react';
import { mount } from 'enzyme';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p, panel } from '@atlaskit/editor-test-helpers/doc-builder';
import { closestElement } from '@atlaskit/editor-common/utils';

import {
  clickAreaClickHandler,
  checkForModal,
} from '../../../../ui/Addon/click-area-helper';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { GapCursorSelection, Side } from '@atlaskit/editor-common/selection';
import * as commands from '@atlaskit/editor-common/commands';
import * as selectionUtils from '@atlaskit/editor-common/selection';

import Modal from '@atlaskit/modal-dialog';

jest.mock('@atlaskit/editor-common/selection', () => ({
  __esModule: true,
  ...jest.requireActual<Object>('@atlaskit/editor-common/selection'),
}));
jest.mock('@atlaskit/editor-common/commands', () => ({
  __esModule: true,
  ...jest.requireActual<Object>('@atlaskit/editor-common/commands'),
}));
jest.mock('@atlaskit/editor-common/utils', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common/utils'),
  closestElement: jest.fn(),
}));

const Editor = (props: any) => (
  <div onClick={props.handleClick}>
    <div className="akEditor">
      <div className="ak-editor-content-area">
        <div className="child-ak-editor-content-area"></div>
      </div>
    </div>
    <div className="outside-ak-editor-content-area"></div>
  </div>
);

const DummyComponent = (props: any) => {
  if (props.renderInsideModal) {
    return (
      <Modal>
        <Editor handleClick={props.handleClick} />
      </Modal>
    );
  }

  return <Editor handleClick={props.handleClick} />;
};

describe('Editor click area handler', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: { allowPanel: true },
    });

  let wrapper: any;
  let editorView: EditorView;

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
          selectionUtils,
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
      expect(selection instanceof GapCursorSelection).toBeTruthy();
      expect(selection.side).toEqual(Side.LEFT);
    });

    it('should call view.focus when a Gapcursor is set', () => {
      editorView = editor(doc(panel()(p('{<>}')))).editorView;
      const focusSpy = jest.spyOn(editorView, 'focus');
      wrapper
        .find('.ak-editor-content-area')
        .simulate('click', { clientY: -10 });
      const selection = editorView.state.selection as GapCursorSelection;
      expect(selection instanceof GapCursorSelection).toBeTruthy();
      expect(selection.side).toEqual(Side.LEFT);
      expect(focusSpy).toHaveBeenCalled();
    });
  });

  describe('for modal support', () => {
    it('should call view.focus when an editor is used inside modal', () => {
      const focusSpy = jest.spyOn(editorView, 'focus');
      wrapper = mount(
        <DummyComponent
          handleClick={(event: React.MouseEvent<any>) => {
            clickAreaClickHandler(editorView, event);
          }}
          renderInsideModal
        />,
      );

      wrapper
        .find('.ak-editor-content-area')
        .simulate('click', { clientY: -10 });

      expect(focusSpy).toHaveBeenCalled();
    });

    it('should NOT call view.focus when a modal is open when editing', () => {
      const focusSpy = jest.spyOn(editorView, 'focus');
      const onClickButtonHandler = jest.fn();
      wrapper = mount(
        <>
          <DummyComponent
            handleClick={(event: React.MouseEvent<any>) => {
              clickAreaClickHandler(editorView, event);
            }}
          />
          <Modal>
            <div>Some Content</div>
            <button id="test-button" onClick={onClickButtonHandler}></button>
          </Modal>
        </>,
      );

      wrapper.find('#test-button').simulate('click');

      expect(onClickButtonHandler).toHaveBeenCalled();
      expect(focusSpy).not.toHaveBeenCalled();
    });
  });

  // @see ED-5126
  it('should not set a GapCursor and not append a paragraph node when a Popup is clicked', () => {
    editorView = editor(doc(p('Hello world'))).editorView;
    (closestElement as any).mockImplementation(() => ({}));
    wrapper.find('.ak-editor-content-area').simulate('click', { clientY: 10 });
    const selection = editorView.state.selection as GapCursorSelection;
    expect(selection instanceof GapCursorSelection).toBeFalsy();
    expect(editorView.state.doc).toEqualDocument(doc(p('Hello world')));
  });
});

describe('checkForModal', () => {
  it('should return true when editor is rendered inside a modal', () => {
    let results: any;
    const wrapper = mount(
      <DummyComponent
        handleClick={(event: React.MouseEvent<any>) => {
          results = checkForModal(event.target as HTMLElement);
        }}
        renderInsideModal
      />,
    );

    wrapper.find('.ak-editor-content-area').simulate('click', { clientY: -10 });

    expect(results).toBeTruthy();
  });

  it('should return false when a modal is open over an editor', () => {
    let results: any;
    const onClickButtonHandler = jest.fn();
    const wrapper = mount(
      <>
        <DummyComponent
          handleClick={(event: React.MouseEvent<any>) => {
            results = checkForModal(event.target as HTMLElement);
          }}
        />
        <Modal>
          <div>Some Content</div>
          <button id="test-button" onClick={onClickButtonHandler}></button>
        </Modal>
      </>,
    );

    wrapper.find('#test-button').simulate('click');

    expect(results).toBeFalsy();
  });

  it("should return true when there isn't an open modal", () => {
    let results: any;
    const wrapper = mount(
      <DummyComponent
        handleClick={(event: React.MouseEvent<any>) => {
          results = checkForModal(event.target as HTMLElement);
        }}
      />,
    );

    wrapper.find('.ak-editor-content-area').simulate('click', { clientY: -10 });

    expect(results).toBeTruthy();
  });
});

describe('when click coming from', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: { allowPanel: true },
    });

  const DummyComponent = (props: any) => {
    return <props.Editor handleClick={props.handleClick} />;
  };

  describe('a button', () => {
    const Editor = (props: any) => (
      <div onClick={props.handleClick}>
        <div className="akEditor">
          <div className="ak-editor-content-area">
            <button id="fake-button">Button </button>
            <div className="child-ak-editor-content-area"></div>
          </div>
        </div>
        <div className="outside-ak-editor-content-area"></div>
      </div>
    );

    it('should not focus on editor', () => {
      const editorView = editor(doc(panel()(p('{<>}')))).editorView;
      const focusSpy = jest.spyOn(editorView, 'focus');

      const wrapper = mount(
        <DummyComponent
          handleClick={(event: React.MouseEvent<any>) => {
            clickAreaClickHandler(editorView, event);
          }}
          Editor={Editor}
        />,
      );

      wrapper.find('#fake-button').simulate('click', { clientY: -10 });

      expect(focusSpy).not.toHaveBeenCalled();
    });
  });

  describe('within #column-picker-popup', () => {
    const Editor = (props: any) => (
      <div onClick={props.handleClick}>
        <div className="akEditor">
          <div className="ak-editor-content-area">
            <div className="child-ak-editor-content-area"></div>
          </div>
        </div>
        <div className="outside-ak-editor-content-area">
          <div id="column-picker-popup">
            <div id="something-inside-column-picker"></div>
          </div>
        </div>
      </div>
    );

    it('should not focus on editor', () => {
      const editorView = editor(doc(panel()(p('{<>}')))).editorView;
      const focusSpy = jest.spyOn(editorView, 'focus');

      const wrapper = mount(
        <DummyComponent
          handleClick={(event: React.MouseEvent<any>) => {
            clickAreaClickHandler(editorView, event);
          }}
          Editor={Editor}
        />,
      );

      wrapper
        .find('#something-inside-column-picker')
        .simulate('click', { clientY: -10 });

      expect(focusSpy).not.toHaveBeenCalled();
    });
  });
});
