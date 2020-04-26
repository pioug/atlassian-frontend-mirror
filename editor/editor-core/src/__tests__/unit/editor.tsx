import { name } from '../../version.json';
import { mount, shallow } from 'enzyme';
import React from 'react';
import Editor from '../../editor';
import { EditorView } from 'prosemirror-view';
import Button from '@atlaskit/button';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { analyticsClient } from '@atlaskit/editor-test-helpers/analytics-client-mock';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { createFakeExtensionProvider } from '@atlaskit/editor-test-helpers/extensions';
import FabricAnalyticsListeners, {
  AnalyticsWebClient,
} from '@atlaskit/analytics-listeners';
import {
  GasPurePayload,
  GasPureScreenEventPayload,
} from '@atlaskit/analytics-gas-types';
import { EDITOR_APPEARANCE_CONTEXT } from '@atlaskit/analytics-namespaced-context';
import { QuickInsertProvider } from '@atlaskit/editor-common/provider-factory';
import { EditorAppearance } from '../../types';
import * as extensionUtils from '../../utils/extensions';

import {
  name as packageName,
  version as packageVersion,
} from '../../version-wrapper';

describe(name, () => {
  describe('Editor', () => {
    describe('callbacks', () => {
      it('should fire onChange when text is inserted', () => {
        const handleChange = jest.fn();

        const wrapper = mount(<Editor onChange={handleChange} />);

        const editorView: EditorView = (wrapper.instance() as any).editorActions
          .editorView;

        insertText(editorView, 'hello', 0);
        expect(handleChange).toHaveBeenCalled();
      });

      describe('Comment appearance', () => {
        it('should fire onSave when Save is clicked', () => {
          const handleSave = jest.fn();
          const wrapper = mount(
            <Editor onSave={handleSave} appearance="comment" />,
          );

          const saveButton = wrapper.find(Button).findWhere(node => {
            return node.type() !== undefined && node.text() === 'Save';
          });

          saveButton.first().simulate('click');
          expect(handleSave).toHaveBeenCalled();
        });

        it('should fire onCancel when Cancel is clicked', () => {
          const cancelled = jest.fn();
          const wrapper = mount(
            <Editor onCancel={cancelled} appearance="comment" />,
          );

          const cancelButton = wrapper.find(Button).findWhere(node => {
            return node.type() !== undefined && node.text() === 'Cancel';
          });

          cancelButton.first().simulate('click');
          expect(cancelled).toHaveBeenCalled();
        });
      });

      it('should fire onEditorReady when ready', () => {
        const onEditorReady = jest.fn();
        mount(<Editor onEditorReady={onEditorReady} />);

        expect(onEditorReady).toHaveBeenCalled();
      });
    });

    describe('save on enter', () => {
      it('should fire onSave when user presses Enter', () => {
        const handleSave = jest.fn();
        const wrapper = mount(
          <Editor onSave={handleSave} saveOnEnter={true} />,
        );

        const editorView: EditorView = (wrapper.instance() as any).editorActions
          .editorView;

        sendKeyToPm(editorView, 'Enter');
        expect(handleSave).toHaveBeenCalled();
      });
    });

    describe('submit-editor (save on mod-enter)', () => {
      it('should fire onSave when user presses Enter', () => {
        const handleSave = jest.fn();
        const wrapper = mount(<Editor onSave={handleSave} />);

        const editorView: EditorView = (wrapper.instance() as any).editorActions
          .editorView;

        sendKeyToPm(editorView, 'Mod-Enter');
        expect(handleSave).toHaveBeenCalled();
      });
    });

    describe('analytics', () => {
      const mockAnalyticsClient = (
        analyticsAppearance: EDITOR_APPEARANCE_CONTEXT,
        done: jest.DoneCallback,
      ): AnalyticsWebClient => {
        const analyticsEventHandler = (
          event: GasPurePayload | GasPureScreenEventPayload,
        ) => {
          expect(event.attributes).toMatchObject({
            appearance: analyticsAppearance,
            packageName,
            packageVersion,
            componentName: 'editorCore',
          });
          done();
        };

        return analyticsClient(analyticsEventHandler);
      };

      const appearances: {
        appearance: EditorAppearance;
        analyticsAppearance: EDITOR_APPEARANCE_CONTEXT;
      }[] = [
        {
          appearance: 'full-page',
          analyticsAppearance: EDITOR_APPEARANCE_CONTEXT.FIXED_WIDTH,
        },
        {
          appearance: 'comment',
          analyticsAppearance: EDITOR_APPEARANCE_CONTEXT.COMMENT,
        },
        {
          appearance: 'full-width',
          analyticsAppearance: EDITOR_APPEARANCE_CONTEXT.FULL_WIDTH,
        },
      ];
      appearances.forEach(appearance => {
        it(`adds appearance analytics context to all editor events for ${appearance.appearance} editor`, done => {
          // editor fires an editor started event that should trigger the listener from
          // just mounting the component
          mount(
            <FabricAnalyticsListeners
              client={mockAnalyticsClient(appearance.analyticsAppearance, done)}
            >
              <Editor appearance={appearance.appearance} allowAnalyticsGASV3 />
            </FabricAnalyticsListeners>,
          );
        });
      });

      it('should update appearance used in events when change appearance prop', done => {
        const wrapper = mount(
          <FabricAnalyticsListeners
            client={mockAnalyticsClient(
              EDITOR_APPEARANCE_CONTEXT.FULL_WIDTH,
              done,
            )}
          >
            <Editor appearance="full-page" allowAnalyticsGASV3 />
          </FabricAnalyticsListeners>,
        );

        // toggling full-width mode triggers a changedFullWidthMode analytics event
        // which should have the new appearance
        wrapper.setProps({
          children: <Editor appearance="full-width" allowAnalyticsGASV3 />,
        });
      });
    });

    describe('providers', () => {
      const quickInsertProvider = Promise.resolve({} as QuickInsertProvider);

      const extensionProvider = createFakeExtensionProvider(
        'fake.confluence',
        'extension',
        () => <div>Fake extension</div>,
      );

      it('should set extensionProvider quickInsert provider even when quickInsertProvider is not provided', () => {
        const wrapper = shallow(
          <Editor extensionProviders={[extensionProvider]} />,
        );

        expect(wrapper.state('quickInsertProvider')).toBeDefined();
      });

      it('should just set quickInsertProvider if there is no extensionProvider', () => {
        const wrapper = shallow(
          <Editor quickInsert={{ provider: quickInsertProvider }} />,
        );

        expect(wrapper.state('quickInsertProvider')).toBe(quickInsertProvider);
      });

      it('should combine them if both quickInsertProvider and extensionProvider are provided', () => {
        const combineQuickInsertProvidersSpy = jest.spyOn(
          extensionUtils,
          'combineQuickInsertProviders',
        );

        const wrapper = shallow(
          <Editor
            extensionProviders={[extensionProvider]}
            quickInsert={{ provider: quickInsertProvider }}
          />,
        );

        expect(wrapper.state('quickInsertProvider')).toBeDefined();
        expect(combineQuickInsertProvidersSpy).toHaveBeenCalledTimes(1);
        // Call 0, Argument 0, Array item 0
        expect(combineQuickInsertProvidersSpy.mock.calls[0][0][0]).toBe(
          quickInsertProvider,
        );

        combineQuickInsertProvidersSpy.mockReset();
        combineQuickInsertProvidersSpy.mockRestore();
      });

      it('should not set quickInsertProvider if neither quickInsertProvider or extensionProvider provided', () => {
        const wrapper = shallow(<Editor />);

        expect(wrapper.state('quickInsertProvider')).toBeUndefined();
      });
    });
  });
});
