import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import { ClickAreaBlock } from '../../../../ui/Addon';
import * as ClickAreaHelper from '../../../../ui/Addon/click-area-helper';

const clickWrapperId = 'click-wrapper';
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
    render(<ClickAreaBlock editorView={editorView} />);

    fireEvent.mouseDown(screen.getByTestId(clickWrapperId), { clientY: 200 });
    expect(clickAreaClickHandlerMock).toHaveBeenCalledTimes(1);
    expect(clickAreaClickHandlerMock).toHaveBeenCalledWith(
      editorView,
      expect.any(Object),
    );
  });

  it('should not invoke clickAreaClickHandler when clicked and view is not defined', () => {
    render(<ClickAreaBlock />);
    fireEvent.mouseDown(screen.getByTestId(clickWrapperId), { clientY: 200 });
    expect(clickAreaClickHandlerMock).toHaveBeenCalledTimes(0);
  });
});
