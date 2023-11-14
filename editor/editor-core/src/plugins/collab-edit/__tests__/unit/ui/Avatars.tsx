import React from 'react';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { createMockCollabEditProvider } from '@atlaskit/synchrony-test-helpers';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { mountWithIntl } from '../../../../../__tests__/__helpers/enzyme';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';

import type { PluginState } from '../../../plugin';
import { pluginKey } from '../../../plugin';

import AvatarsWithPluginState from '../../../ui';
import ToolbarButton from '../../../../../ui/ToolbarButton';

// Editor plugins
import collabEditPlugin from '../../../index';
import { mentionsPlugin } from '@atlaskit/editor-plugin-mentions';
import { typeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';

describe('collab-edit | Avatars', () => {
  const createEditor = createProsemirrorEditorFactory();

  const providerFactory = ProviderFactory.create({
    collabEditProvider: createMockCollabEditProvider('rick'),
    mentionProvider: new Promise(() => {}),
  });
  const preset = new Preset<LightEditorPlugin>()
    .add([featureFlagsPlugin, {}])
    .add([analyticsPlugin, {}])
    .add([collabEditPlugin, {}])
    .add(typeAheadPlugin)
    .add(mentionsPlugin);

  const editor = (doc: DocBuilder) =>
    createEditor<PluginState, PluginKey, typeof preset>({
      doc,
      preset,
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

      const { editorView, editorAPI } = editor(doc(p('text')));
      setPresence(editorView);

      const node = mountWithIntl(
        <AvatarsWithPluginState
          editorView={editorView}
          inviteToEditComponent={CustomButton}
          featureFlags={{}}
          editorAnalyticsAPI={editorAPI?.analytics?.actions}
        />,
      );

      expect(node.find(CustomButton).length).toEqual(1);
      node.unmount();
    });
  });

  describe('when inviteToEditButton is undefined', () => {
    describe('when inviteToEditHandler is undefined', () => {
      it('should not render inviteToEdit button', async () => {
        const { editorView, editorAPI } = editor(doc(p('text')));
        const node = mountWithIntl(
          <AvatarsWithPluginState
            editorView={editorView}
            featureFlags={{}}
            editorAnalyticsAPI={editorAPI?.analytics?.actions}
          />,
        );
        expect(node.find(ToolbarButton).length).toEqual(0);
        node.unmount();
      });
    });

    describe('when inviteToEditHandler is provided', () => {
      it('should render inviteToEdit button', async () => {
        const { editorView, editorAPI } = editor(doc(p('text')));
        setPresence(editorView);

        const node = mountWithIntl(
          <AvatarsWithPluginState
            editorView={editorView}
            inviteToEditHandler={() => {}}
            featureFlags={{}}
            editorAnalyticsAPI={editorAPI?.analytics?.actions}
          />,
        );

        expect(node.find(ToolbarButton).length).toEqual(1);
        node.unmount();
      });

      describe('when inviteToEdit is clicked', () => {
        it('should call inviteToEditHandler', async () => {
          const { editorView, editorAPI } = editor(doc(p('text')));
          setPresence(editorView);
          const inviteToEditHandler = jest.fn();
          const node = mountWithIntl(
            <AvatarsWithPluginState
              editorView={editorView}
              inviteToEditHandler={inviteToEditHandler}
              featureFlags={{}}
              editorAnalyticsAPI={editorAPI?.analytics?.actions}
            />,
          );
          node.find(ToolbarButton).at(0).find('button').simulate('click');
          expect(inviteToEditHandler).toHaveBeenCalledTimes(1);
          node.unmount();
        });
      });

      describe('when isInviteToEditButtonSelected is true', () => {
        it('should make inviteToEdit button selected', async () => {
          const { editorView, editorAPI } = editor(doc(p('text')));
          setPresence(editorView);
          const inviteToEditHandler = () => {};
          const node = mountWithIntl(
            <AvatarsWithPluginState
              editorView={editorView}
              inviteToEditHandler={inviteToEditHandler}
              isInviteToEditButtonSelected={true}
              featureFlags={{}}
              editorAnalyticsAPI={editorAPI?.analytics?.actions}
            />,
          );
          expect(node.find(ToolbarButton).at(0).prop('selected')).toBe(true);
          node.unmount();
        });
      });
    });
  });
});
