import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  table,
  td,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { fireEvent } from '@testing-library/react';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import React from 'react';
import type { Command, FloatingToolbarDropdown } from '../../types';
import Toolbar from '../../ui/Toolbar';
import type { DropdownOptions } from '../../ui/types';
import ReactEditorViewContext from '../../../../create-editor/ReactEditorViewContext';

describe('Dropdown', () => {
  describe('Accessibility', () => {
    it('should have accessibility attributes for dropdown menu button', () => {
      const { button } = getDropdownSetup();

      expect(button.getAttribute('aria-expanded')).toBeTruthy();
      expect(button.getAttribute('aria-haspopup')).toBeTruthy();
      expect(button.getAttribute('aria-controls')).toBe(
        'dropdownId-dropdownList',
      );
    });

    it('should have accessibility attributes for dropdown list', () => {
      const { button, container } = getDropdownSetup();
      fireEvent.click(button);

      const dropdownList = container.querySelector('#dropdownId-dropdownList');

      expect(dropdownList?.getAttribute('role')).toBe('menu');
    });

    it('should tell when dropdown menu is expanded', () => {
      const { button } = getDropdownSetup();

      expect(button.getAttribute('aria-expanded')).toBe('false');

      fireEvent.click(button);

      expect(button.getAttribute('aria-expanded')).toBe('true');
    });
  });
});

const getDropdownSetup = (): {
  editorView: EditorView;
  dropdown: FloatingToolbarDropdown<Command>;
  container: HTMLElement;
  button: HTMLButtonElement;
} => {
  const createEditor = createEditorFactory();
  const docNode = doc(
    table()(tr(td({})(p())), tr(td({})(p())), tr(td({})(p()))),
  );
  const { editorView } = createEditor({
    doc: docNode,
    editorProps: {
      allowTables: true,
    },
  });
  const editorRef = {
    current: document.createElement('div'),
  };

  const dropdownOptions: DropdownOptions<Command> = [
    {
      id: 'option1',
      title: 'title1',
      onClick: jest.fn(),
      selected: false,
    },
    {
      id: 'option12',
      title: 'title2',
      onClick: jest.fn(),
      selected: false,
    },
  ];

  const dropdown: FloatingToolbarDropdown<Command> = {
    testId: 'testId',
    id: 'dropdownId',
    type: 'dropdown',
    title: 'title',
    options: dropdownOptions,
  };

  const { container } = renderWithIntl(
    <ReactEditorViewContext.Provider
      value={{
        editorRef: editorRef,
      }}
    >
      <Toolbar
        editorView={editorView}
        node={editorView.state.doc.firstChild!}
        items={[dropdown]}
        dispatchAnalyticsEvent={jest.fn()}
        dispatchCommand={jest.fn()}
        featureFlags={{}}
        api={undefined}
      />
    </ReactEditorViewContext.Provider>,
  );

  const button = container.querySelector('button') as HTMLButtonElement;

  return {
    editorView,
    dropdown,
    container,
    button,
  };
};
