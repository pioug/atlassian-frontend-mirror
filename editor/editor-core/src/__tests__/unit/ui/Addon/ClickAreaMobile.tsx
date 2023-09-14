import React from 'react';
import { mount } from 'enzyme';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import { ClickAreaMobile } from '../../../../ui/Addon';
import * as ClickAreaHelper from '../../../../ui/Addon/click-area-helper';

describe('ClickAreaMobile', () => {
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

  it('should set the min height of the click area as passed and set in styles', () => {
    const clickWrapper = mount(
      <ClickAreaMobile minHeight={200} isExpanded={true} />,
    );
    expect(clickWrapper).toMatchSnapshot();
  });

  it('should set the min height of the click area as passed, but not set in styles', () => {
    const clickWrapper = mount(
      <ClickAreaMobile minHeight={200} isExpanded={false} />,
    );
    expect(clickWrapper).toMatchSnapshot();
  });

  it(`should call event.preventDefault when user clicks on click area beyond content area
    to retain focus in editor content area`, () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    const { editorView } = editor(doc(p('Hello world')));
    const clickWrapper = mount(
      <ClickAreaMobile editorView={editorView} minHeight={200} />,
    );
    const event = { clientX: 50, clientY: 100, preventDefault: jest.fn() };
    clickWrapper.simulate('click', event);
    expect(event.preventDefault).toHaveBeenCalled();
  });
});
