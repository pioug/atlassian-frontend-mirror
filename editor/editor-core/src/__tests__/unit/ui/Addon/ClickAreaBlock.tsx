import React from 'react';
import { mount } from 'enzyme';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { ClickAreaBlock } from '../../../../ui/Addon';
import * as ClickAreaHelper from '../../../../ui/Addon/click-area-helper';

describe('ClickAreaBlock', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: { allowPanel: true },
    });
  let clickAreaClickHandlerMock: any;
  beforeEach(() => {
    clickAreaClickHandlerMock = jest.spyOn(
      ClickAreaHelper,
      'clickAreaClickHandler',
    );
    clickAreaClickHandlerMock.mockImplementation(() => {});
  });
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });
  it('should invoke clickAreaClickHandler when clicked', () => {
    const { editorView } = editor(doc(p('Hello world')));
    const clickWrapper = mount(<ClickAreaBlock editorView={editorView} />);
    clickWrapper.simulate('click');
    expect(clickAreaClickHandlerMock).toHaveBeenCalledTimes(1);
    expect(clickAreaClickHandlerMock).toHaveBeenCalledWith(
      editorView,
      expect.any(Object),
    );
  });

  it('should not invoke clickAreaClickHandler when clicked and view is not defined', () => {
    const clickWrapper = mount(<ClickAreaBlock />);
    clickWrapper.simulate('click');
    expect(clickAreaClickHandlerMock).toHaveBeenCalledTimes(0);
  });
});
