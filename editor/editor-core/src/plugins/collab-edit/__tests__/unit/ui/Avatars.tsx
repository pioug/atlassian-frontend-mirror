import React from 'react';
import { EditorView } from 'prosemirror-view';
import { PluginKey } from 'prosemirror-state';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { createMockCollabEditProvider } from '@atlaskit/synchrony-test-helpers';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

import { PluginState, pluginKey } from '../../../plugin';

import AvatarsWithPluginState from '../../../ui';
import ToolbarButton from '../../../../../ui/ToolbarButton';

// Editor plugins
import collabEditPlugin from '../../../index';
import mentionsPlugin from '../../../../mentions';

describe('collab-edit | Avatars', () => {
  const createEditor = createProsemirrorEditorFactory();

  const providerFactory = ProviderFactory.create({
    collabEditProvider: createMockCollabEditProvider('rick'),
    mentionProvider: new Promise(() => {}),
  });

  const editor = (doc: DocBuilder) =>
    createEditor<PluginState, PluginKey>({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([collabEditPlugin, {}])
        .add(mentionsPlugin),
      pluginKey,
      providerFactory,
    });

  const setPresence = (editorView: EditorView) => {
    editorView.dispatch(
      editorView.state.tr.setMeta('presence', {
        left: [],
        joined: [
          {
            sessionId: 'test',
            lastActive: 1,
            avatar: 'avatar.png',
            name: 'Bob',
          },
        ],
      }),
    );
  };

  afterEach(() => {
    providerFactory.destroy();
  });

  describe('when inviteToEditButton is provided', () => {
    it('should render inviteToEditButton', async () => {
      const CustomButton = () => <button />;

      const { editorView } = editor(doc(p('text')));
      setPresence(editorView);

      const node = mountWithIntl(
        <AvatarsWithPluginState
          editorView={editorView}
          inviteToEditComponent={CustomButton}
        />,
      );

      expect(node.find(CustomButton).length).toEqual(1);
      node.unmount();
    });
  });

  describe('when inviteToEditButton is undefined', () => {
    describe('when inviteToEditHandler is undefined', () => {
      it('should not render inviteToEdit button', async () => {
        const { editorView } = editor(doc(p('text')));
        const node = mountWithIntl(
          <AvatarsWithPluginState editorView={editorView} />,
        );
        expect(node.find(ToolbarButton).length).toEqual(0);
        node.unmount();
      });
    });

    describe('when inviteToEditHandler is provided', () => {
      it('should render inviteToEdit button', async () => {
        const { editorView } = editor(doc(p('text')));
        setPresence(editorView);

        const node = mountWithIntl(
          <AvatarsWithPluginState
            editorView={editorView}
            inviteToEditHandler={() => {}}
          />,
        );

        expect(node.find(ToolbarButton).length).toEqual(1);
        node.unmount();
      });

      describe('when inviteToEdit is clicked', () => {
        it('should call inviteToEditHandler', async () => {
          const { editorView } = editor(doc(p('text')));
          setPresence(editorView);
          const inviteToEditHandler = jest.fn();
          const node = mountWithIntl(
            <AvatarsWithPluginState
              editorView={editorView}
              inviteToEditHandler={inviteToEditHandler}
            />,
          );
          node.find(ToolbarButton).at(0).find('button').simulate('click');
          expect(inviteToEditHandler).toHaveBeenCalledTimes(1);
          node.unmount();
        });
      });

      describe('when isInviteToEditButtonSelected is true', () => {
        it('should make inviteToEdit button selected', async () => {
          const { editorView } = editor(doc(p('text')));
          setPresence(editorView);
          const inviteToEditHandler = () => {};
          const node = mountWithIntl(
            <AvatarsWithPluginState
              editorView={editorView}
              inviteToEditHandler={inviteToEditHandler}
              isInviteToEditButtonSelected={true}
            />,
          );
          expect(node.find(ToolbarButton).at(0).prop('selected')).toBe(true);
          node.unmount();
        });
      });
    });
  });
});
