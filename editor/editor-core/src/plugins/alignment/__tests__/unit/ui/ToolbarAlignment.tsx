import React from 'react';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { ReactWrapper } from 'enzyme';
import { pluginKey } from '../../../pm-plugins/main';
import ToolbarAlignment, {
  Props as ToolbarAlignmentProps,
} from '../../../ui/ToolbarAlignment';
import { PluginKey } from 'prosemirror-state';
import { AlignmentPluginState } from '../../../pm-plugins/types';
import alignmentPlugin from '../../../';

describe('ToolbarAlignment', () => {
  const createEditor = createProsemirrorEditorFactory();
  let toolbarAlignment: ReactWrapper<ToolbarAlignmentProps>;

  const editor = (doc: DocBuilder) =>
    createEditor<AlignmentPluginState, PluginKey>({
      doc,
      pluginKey,
      preset: new Preset<LightEditorPlugin>().add(alignmentPlugin),
    });

  beforeEach(() => {
    const { editorView } = editor(doc(p('text')));
    const pluginState = pluginKey.getState(editorView.state);
    toolbarAlignment = mountWithIntl(
      <ToolbarAlignment
        pluginState={pluginState}
        changeAlignment={jest.fn()}
      />,
    );
  });

  afterEach(() => {
    if (toolbarAlignment && typeof toolbarAlignment.unmount === 'function') {
      toolbarAlignment.unmount();
    }
  });

  it('should open menu when toolbar alignment button is clicked', () => {
    toolbarAlignment.find('button').simulate('click');

    expect(toolbarAlignment.state('isOpen')).toBe(true);
  });

  it('should close menu when an option is clicked', () => {
    toolbarAlignment.find('button').simulate('click');
    toolbarAlignment.find('.align-btn').at(1).simulate('click');

    expect(toolbarAlignment.state('isOpen')).toBe(false);
  });

  it('should close menu when toolbar alignment button is clicked again', () => {
    toolbarAlignment.find('button').simulate('click');
    toolbarAlignment.find('button').at(0).simulate('click');

    expect(toolbarAlignment.state('isOpen')).toBe(false);
  });
});
