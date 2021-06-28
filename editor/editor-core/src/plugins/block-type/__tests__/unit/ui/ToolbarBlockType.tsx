import React from 'react';
import Item from '@atlaskit/item';
import AkButton from '@atlaskit/button/standard-button';
import {
  doc,
  p,
  code_block,
  blockquote,
  panel,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import TextStyleIcon from '@atlaskit/icon/glyph/editor/text-style';

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
import { ReactWrapper } from 'enzyme';
import { PluginKey } from 'prosemirror-state';
import { messages } from '../../../messages';
import blockTypePlugin from '../../../';
import panelPlugin from '../../../../panel';
import codeBlockPlugin from '../../../../code-block';

describe('@atlaskit/editor-core/ui/ToolbarBlockType', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) =>
    createEditor<BlockTypeState, PluginKey>({
      doc,
      pluginKey,
      preset: new Preset<LightEditorPlugin>()
        .add(blockTypePlugin)
        .add(codeBlockPlugin)
        .add(panelPlugin),
    });

  it('should render disabled ToolbarButton if isDisabled property is true', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const { state, dispatch } = editorView;
    const toolbarOption = mountWithIntl(
      <ToolbarBlockType
        pluginState={pluginState}
        setBlockType={(name) => setBlockType(name)(state, dispatch)}
        isDisabled={true}
      />,
    );
    expect(toolbarOption.find(AkButton).prop('isDisabled')).toBe(true);
    toolbarOption.unmount();
  });

  it('should render disabled ToolbarButton if current selection is blockquote', () => {
    const { editorView, pluginState } = editor(doc(blockquote(p('te{<>}xt'))));
    const { state, dispatch } = editorView;
    const toolbarOption = mountWithIntl(
      <ToolbarBlockType
        pluginState={pluginState}
        setBlockType={(name) => setBlockType(name)(state, dispatch)}
        isDisabled={true}
      />,
    );
    expect(toolbarOption.find(AkButton).prop('isDisabled')).toBe(true);
    toolbarOption.unmount();
  });

  it('should not render disabled ToolbarButton if current selection is panel', () => {
    const { editorView, pluginState } = editor(doc(panel()(p('te{<>}xt'))));
    const { state, dispatch } = editorView;

    const toolbarOption = mountWithIntl(
      <ToolbarBlockType
        pluginState={pluginState}
        setBlockType={(name) => setBlockType(name)(state, dispatch)}
      />,
    );
    expect(toolbarOption.find(AkButton).prop('isDisabled')).toBe(false);
    toolbarOption.unmount();
  });

  it('should render disabled ToolbarButton if code-block is selected', () => {
    const { editorView, pluginState } = editor(
      doc(code_block({ language: 'js' })('te{<>}xt')),
    );
    const { state, dispatch } = editorView;
    const toolbarOption = mountWithIntl(
      <ToolbarBlockType
        pluginState={pluginState}
        setBlockType={(name) => setBlockType(name)(state, dispatch)}
        isDisabled={true}
      />,
    );
    expect(toolbarOption.find(AkButton).prop('isDisabled')).toBe(true);
    toolbarOption.unmount();
  });

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
    const toolbarOption = mountWithIntl(
      <ToolbarBlockType
        pluginState={pluginState}
        setBlockType={(name) => setBlockType(name)(state, dispatch)}
        isSmall={true}
      />,
    );
    expect(toolbarOption.find(ToolbarButton).find(TextStyleIcon).length).toBe(
      1,
    );
    toolbarOption.unmount();
  });

  it('should render current block type in dropdown-menu if property isSmall=false', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const { state, dispatch } = editorView;
    const toolbarOption = mountWithIntl(
      <ToolbarBlockType
        pluginState={pluginState}
        setBlockType={(name) => setBlockType(name)(state, dispatch)}
      />,
    );
    expect(toolbarOption.find(ToolbarButton).first().text()).toContain(
      messages.normal.defaultMessage,
    );
    toolbarOption.unmount();
  });

  describe('blockType dropdown items', () => {
    let toolbarOption: ReactWrapper;
    beforeEach(() => {
      const { editorView, pluginState } = editor(doc(p('text')));
      const { state, dispatch } = editorView;
      toolbarOption = mountWithIntl(
        <ToolbarBlockType
          pluginState={pluginState}
          setBlockType={(name) => setBlockType(name)(state, dispatch)}
        />,
      );
      toolbarOption.find('button').simulate('click');
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
        expect(
          toolbarOption
            .find(Item)
            .findWhere(
              (n) =>
                n.type() === blockType.tagName &&
                n.text() === blockType.title.defaultMessage,
            ).length,
        ).toEqual(1);
      });
    });
  });
});
