// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import React from 'react';

import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type {
  Command,
  DropdownOptions,
  FloatingToolbarDropdown,
} from '@atlaskit/editor-common/types';
import { ReactEditorViewContext } from '@atlaskit/editor-common/ui-react';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points, import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points, import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  table,
  td,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points, import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';

import Toolbar from '../../ui/Toolbar';

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

      expect(dropdownList?.getAttribute('role')).toBe('presentation');
    });

    it('should tell when dropdown menu is expanded', () => {
      const { button } = getDropdownSetup();

      expect(button.getAttribute('aria-expanded')).toBe('false');

      fireEvent.click(button);

      expect(button.getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('onToggle functionality', async () => {
    beforeAll(() => {
      jest
        .spyOn(window, 'requestAnimationFrame')
        .mockImplementation((cb: Function) => cb());
    });
    it('should call onToggle when dropdown menu is expanded', async () => {
      const onToggle = jest.fn();
      const { button } = getDropdownSetup(onToggle);
      await userEvent.click(button);
      await userEvent.click(button);
      expect(onToggle).toHaveBeenCalledTimes(2);
    });
    afterAll(() => {
      jest.restoreAllMocks();
    });
  });
});

const getDropdownSetup = (
  onToggle?: jest.Mock,
): {
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
    onToggle,
    options: dropdownOptions,
  };

  const dispatchCommand = (command?: Function): void => {
    if (command) {
      command();
    }
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
        dispatchCommand={dispatchCommand}
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
