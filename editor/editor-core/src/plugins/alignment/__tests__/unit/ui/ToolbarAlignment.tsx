import React from 'react';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import type { ReactWrapper } from 'enzyme';
import { pluginKey } from '../../../pm-plugins/main';
import ToolbarAlignment, {
  AlignmentToolbar as BaseToolbarAlignment,
} from '../../../ui/ToolbarAlignment';
import type { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { AlignmentPluginState } from '../../../pm-plugins/types';
import alignmentPlugin from '../../../';
import { mountWithIntl } from '../../../../../__tests__/__helpers/enzyme';

describe('ToolbarAlignment', () => {
  const createEditor = createProsemirrorEditorFactory();
  let toolbarAlignment: ReactWrapper;
  const preset = new Preset<LightEditorPlugin>().add(alignmentPlugin);

  const editor = (doc: DocBuilder) =>
    createEditor<AlignmentPluginState, PluginKey, typeof preset>({
      doc,
      pluginKey,
      preset,
    });

  beforeEach(() => {
    const { editorView } = editor(doc(p('text')));
    const pluginState = pluginKey.getState(editorView.state)!;
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

    expect(toolbarAlignment.find(BaseToolbarAlignment).state('isOpen')).toBe(
      true,
    );
  });

  it('should close menu when an option is clicked', () => {
    toolbarAlignment.find('button').simulate('click');
    toolbarAlignment.find('.align-btn').at(1).find('button').simulate('click');

    expect(toolbarAlignment.find(BaseToolbarAlignment).state('isOpen')).toBe(
      false,
    );
  });

  it('should close menu when toolbar alignment button is clicked again', () => {
    toolbarAlignment.find('button').simulate('click');
    toolbarAlignment.find('button').at(0).simulate('click');

    expect(toolbarAlignment.find(BaseToolbarAlignment).state('isOpen')).toBe(
      false,
    );
  });

  it('should not close menu when toolbar alignment button is selected with keyboard', () => {
    toolbarAlignment.find('button').simulate('click');
    toolbarAlignment
      .find('button')
      .at(0)
      .simulate('keypress', { key: 'Enter' });
    expect(toolbarAlignment.find(BaseToolbarAlignment).state('isOpen')).toBe(
      true,
    );
  });
});
