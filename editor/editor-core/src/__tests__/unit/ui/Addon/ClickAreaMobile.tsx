import React from 'react';
import { mount } from 'enzyme';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p } from '@atlaskit/editor-test-helpers/schema-builder';
import { ClickAreaMobile } from '../../../../ui/Addon';
import * as ClickAreaHelper from '../../../../ui/Addon/click-area-helper';

describe('ClickAreaMobile', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: any) =>
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
    const clickWrapper = mount(
      <ClickAreaMobile editorView={editorView} minHeight={200} />,
    );
    clickWrapper.simulate('click');
    expect(clickAreaClickHandlerMock).toHaveBeenCalledTimes(1);
    expect(clickAreaClickHandlerMock).toHaveBeenCalledWith(
      editorView,
      expect.any(Object),
    );
  });

  it('should not invoke clickAreaClickHandler when clicked and view is not defined', () => {
    const clickWrapper = mount(<ClickAreaMobile minHeight={200} />);
    clickWrapper.simulate('click');
    expect(clickAreaClickHandlerMock).toHaveBeenCalledTimes(0);
  });

  it('should set the min height of the click area as passed', () => {
    const clickWrapper = mount(<ClickAreaMobile minHeight={200} />);
    expect(clickWrapper).toMatchSnapshot();
  });
});
