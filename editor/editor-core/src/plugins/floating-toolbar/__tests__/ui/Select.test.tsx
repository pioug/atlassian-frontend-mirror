import React from 'react';
import { screen, fireEvent, RenderResult } from '@testing-library/react';

import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { doc, code_block } from '@atlaskit/editor-test-helpers/doc-builder';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';

import Toolbar from '../../ui/Toolbar';
import { Command, FloatingToolbarListPicker } from '../../types';
import { EditorView } from 'prosemirror-view';

// Selectors
const selectFieldRole = 'combobox';
const selectFieldRoleOptions = { name: 'Select language' };
const selectMenuSelector = '.floating-toolbar-select__menu';

const getSelectHarness = (): {
  container: RenderResult['container'];
  editorView: EditorView;
  getSelectField: () => HTMLElement;
  getSelectMenu: () => Element | null;
  clickOnSelectField: () => void;
  isSelectMenuOpen: () => boolean;
  pressEscKeyOn: (element: HTMLElement | Element) => void;
} => {
  const { editorView, select } = getToolbarSetup();
  const { container } = renderWithIntl(
    <Toolbar
      editorView={editorView}
      node={editorView.state.doc.firstChild!}
      items={[select]}
      dispatchAnalyticsEvent={jest.fn()}
      dispatchCommand={jest.fn()}
      featureFlags={{}}
    />,
  );

  const getSelectField = () => {
    return screen.getByRole(selectFieldRole, selectFieldRoleOptions);
  };

  const getSelectMenu = () => {
    return container.querySelector(selectMenuSelector);
  };

  const clickOnSelectField = () => {
    const selectField = getSelectField();
    fireEvent.mouseDown(selectField);
  };

  const isSelectMenuOpen = () => {
    return !!document.querySelector('.floating-toolbar-select__menu');
  };

  const pressEscKeyOn = (element: HTMLElement | Element) => {
    fireEvent.keyDown(element, {
      keyCode: 27,
      key: 'Escape',
    });
  };

  return {
    container,
    editorView,
    getSelectField,
    getSelectMenu,
    clickOnSelectField,
    isSelectMenuOpen,
    pressEscKeyOn,
  };
};

describe('<Select />', () => {
  it('renders Select field', () => {
    // Arrange
    getSelectHarness();

    // Assert
    expect(
      screen.getAllByRole(selectFieldRole, selectFieldRoleOptions),
    ).toHaveLength(1);
  });

  describe('when no interaction with Select field', () => {
    it('should not focus on Select field', () => {
      // Arrange
      const { getSelectField } = getSelectHarness();

      // Assert
      expect(getSelectField()).not.toHaveFocus();
    });

    it('should not have Select menu open', () => {
      // Arrange
      const { getSelectMenu } = getSelectHarness();

      // Assert
      expect(getSelectMenu()).not.toBeInTheDocument();
    });
  });

  describe('when click on Select field', () => {
    it('should focus Select field', () => {
      // Arrange
      const { getSelectField, clickOnSelectField } = getSelectHarness();

      // Act
      clickOnSelectField();

      // Assert
      expect(getSelectField()).toHaveFocus();
    });

    it('should open Select menu', () => {
      // Arrange
      const { getSelectMenu, clickOnSelectField } = getSelectHarness();

      // Act
      clickOnSelectField();

      // Assert
      expect(getSelectMenu()).toBeInTheDocument();
    });

    describe('when escape key is pressed', () => {
      it('should close Select menu', async () => {
        // Arrange
        const { getSelectMenu, clickOnSelectField, pressEscKeyOn } =
          getSelectHarness();

        // Act
        clickOnSelectField();
        pressEscKeyOn(getSelectMenu()!);

        // Assert
        expect(getSelectMenu()).not.toBeInTheDocument();
      });

      it('should focus Select field', async () => {
        // Arrange
        const {
          getSelectField,
          getSelectMenu,
          clickOnSelectField,
          pressEscKeyOn,
        } = getSelectHarness();

        // Act
        clickOnSelectField();
        pressEscKeyOn(getSelectMenu()!);

        // Assert
        expect(getSelectField()).toHaveFocus();
      });
    });

    it('should return focus to editorView if pressed twice', () => {
      // Arrange
      const {
        editorView,
        getSelectField,
        isSelectMenuOpen,
        getSelectMenu,
        clickOnSelectField,
        pressEscKeyOn,
      } = getSelectHarness();

      const focusSpy = jest.spyOn(editorView, 'focus');

      // Act
      clickOnSelectField();

      // Assert - menu open
      expect(isSelectMenuOpen()).toBeTruthy();

      // Act
      pressEscKeyOn(getSelectMenu()!);

      // Assert - menu closed
      expect(isSelectMenuOpen()).toBeFalsy();

      // Act
      pressEscKeyOn(getSelectField());

      // Assert - focus returned to editorView
      expect(focusSpy).toHaveBeenCalledTimes(1);
    });
  });
});

const getToolbarSetup = (): {
  editorView: EditorView;
  select: FloatingToolbarListPicker<Command>;
} => {
  const createEditor = createEditorFactory();
  const docNode = doc(code_block({ language: 'js' })('const a = 1;'));
  const { editorView } = createEditor({
    doc: docNode,
    editorProps: {
      allowExtension: {
        allowExtendFloatingToolbars: true,
      },
      shouldFocus: true,
    },
  });

  const selectOptions = [
    { label: 'JavaScript', value: 'js', alias: 'javascript' },
    { label: 'TypeScript', value: 'ts', alias: 'typescript' },
  ];

  const select: FloatingToolbarListPicker<Command> = {
    id: 'editor.codeBlock.languageOptions',
    type: 'select',
    selectType: 'list',
    onChange: jest.fn(),
    defaultValue: selectOptions[0],
    placeholder: 'Select language',
    options: selectOptions,
  };

  return {
    editorView,
    select,
  };
};
