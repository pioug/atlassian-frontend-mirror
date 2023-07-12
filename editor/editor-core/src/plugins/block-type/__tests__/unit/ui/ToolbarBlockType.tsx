import React from 'react';
import { PluginKey } from 'prosemirror-state';
import { RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import {
  doc,
  p,
  code_block,
  blockquote,
  panel,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';

import { mountWithIntl } from '../../../../../__tests__/__helpers/enzyme';
import { BlockTypeState, pluginKey } from '../../../pm-plugins/main';
import ToolbarBlockType from '../../../ui/ToolbarBlockType';
import ToolbarButton from '../../../../../ui/ToolbarButton';
import {
  NORMAL_TEXT,
  HEADING_1,
  HEADING_2,
  HEADING_3,
  HEADING_4,
  HEADING_5,
  HEADING_6,
} from '../../../types';
import { setBlockType } from '../../../commands';
import { messages } from '../../../messages';
import blockTypePlugin from '../../../';
import panelPlugin from '../../../../panel';
import codeBlockPlugin from '../../../../code-block';
import ReactEditorViewContext from '../../../../../create-editor/ReactEditorViewContext';

describe('@atlaskit/editor-core/ui/ToolbarBlockType', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) =>
    createEditor<BlockTypeState, PluginKey>({
      doc,
      pluginKey,
      preset: new Preset<LightEditorPlugin>()
        .add(blockTypePlugin)
        .add(decorationsPlugin)
        .add([codeBlockPlugin, { appearance: 'full-page' }])
        .add(panelPlugin),
    });

  it('should render disabled ToolbarButton if isDisabled property is true', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const { state, dispatch } = editorView;
    const toolbarOption = renderWithIntl(
      <ToolbarBlockType
        pluginState={pluginState}
        setBlockType={(name) => setBlockType(name)(state, dispatch)}
        isDisabled={true}
      />,
    );
    expect(toolbarOption.getByRole('button')).toHaveAttribute('disabled');
    toolbarOption.unmount();
  });

  it('should render disabled ToolbarButton if current selection is blockquote', () => {
    const { editorView, pluginState } = editor(doc(blockquote(p('te{<>}xt'))));
    const { state, dispatch } = editorView;
    const toolbarOption = renderWithIntl(
      <ToolbarBlockType
        pluginState={pluginState}
        setBlockType={(name) => setBlockType(name)(state, dispatch)}
        isDisabled={true}
      />,
    );
    expect(toolbarOption.getByRole('button')).toHaveAttribute('disabled');
    toolbarOption.unmount();
  });

  it('should not render disabled ToolbarButton if current selection is panel', () => {
    const { editorView, pluginState } = editor(doc(panel()(p('te{<>}xt'))));
    const { state, dispatch } = editorView;

    const toolbarOption = renderWithIntl(
      <ToolbarBlockType
        pluginState={pluginState}
        setBlockType={(name) => setBlockType(name)(state, dispatch)}
      />,
    );
    expect(toolbarOption.getByRole('button')).not.toHaveAttribute('disabled');
    toolbarOption.unmount();
  });

  it('should render disabled ToolbarButton if code-block is selected', () => {
    const { editorView, pluginState } = editor(
      doc(code_block({ language: 'js' })('te{<>}xt')),
    );
    const { state, dispatch } = editorView;
    const toolbarOption = renderWithIntl(
      <ToolbarBlockType
        pluginState={pluginState}
        setBlockType={(name) => setBlockType(name)(state, dispatch)}
        isDisabled={true}
      />,
    );
    expect(toolbarOption.getByRole('button')).toHaveAttribute('disabled');
    toolbarOption.unmount();
  });

  // TODO: asserting on a prop, need to convert to VR or something similar
  it('should have spacing of toolbar button set to none if property isReducedSpacing=true', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const { state, dispatch } = editorView;
    const toolbarOption = mountWithIntl(
      <ToolbarBlockType
        pluginState={pluginState}
        setBlockType={(name) => setBlockType(name)(state, dispatch)}
        isReducedSpacing={true}
      />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('spacing')).toBe('none');
    toolbarOption.unmount();
  });

  it('should render icon in dropdown-menu if property isSmall=true', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const { state, dispatch } = editorView;
    const toolbarOption = renderWithIntl(
      <ToolbarBlockType
        pluginState={pluginState}
        setBlockType={(name) => setBlockType(name)(state, dispatch)}
        isSmall={true}
      />,
    );
    expect(
      toolbarOption.getByTestId('toolbar-block-type-text-styles-icon'),
    ).toBeInTheDocument();
    toolbarOption.unmount();
  });

  it('should render current block type in dropdown-menu if property isSmall=false', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const { state, dispatch } = editorView;
    const toolbarOption = renderWithIntl(
      <ToolbarBlockType
        pluginState={pluginState}
        setBlockType={(name) => setBlockType(name)(state, dispatch)}
      />,
    );
    expect(toolbarOption.getByRole('button').innerText).toContain(
      messages.normal.defaultMessage,
    );
    toolbarOption.unmount();
  });

  describe('blockType dropdown items', () => {
    let toolbarOption: RenderResult;
    beforeEach(async () => {
      const { editorView, pluginState } = editor(doc(p('text')));
      const editorRef = {
        current: document.createElement('div'),
      };
      const { state, dispatch } = editorView;
      toolbarOption = renderWithIntl(
        <ReactEditorViewContext.Provider
          value={{
            editorRef,
            editorView,
          }}
        >
          <ToolbarBlockType
            pluginState={pluginState}
            setBlockType={(name) => setBlockType(name)(state, dispatch)}
          />
        </ReactEditorViewContext.Provider>,
      );
      const button = toolbarOption.getByRole('button');
      await userEvent.click(button);
    });

    afterEach(() => {
      toolbarOption.unmount();
    });

    [
      NORMAL_TEXT,
      HEADING_1,
      HEADING_2,
      HEADING_3,
      HEADING_4,
      HEADING_5,
      HEADING_6,
    ].forEach((blockType) => {
      it(`should have tagName ${blockType.tagName} present`, () => {
        const dropdown = toolbarOption.getByRole('group');
        const item = dropdown.querySelector(
          `[data-testId*='dropdown-item__'] ${blockType.tagName}`,
        );
        expect(item).toBeInTheDocument();
      });
    });
  });
});
