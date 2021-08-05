jest.mock('../../../plugins/text-formatting/pm-plugins/input-rule');
import React from 'react';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { ProviderFactory } from '@atlaskit/editor-common';
import ReactEditorView from '../../ReactEditorView';
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
import textFormattingInputRulePlugin from '../../../plugins/text-formatting/pm-plugins/input-rule';
import * as FireAnalyticsEvent from '../../../plugins/analytics/fire-analytics-event';
const portalProviderAPI: any = {
  render() {},
  remove() {},
};
const requiredProps = () => ({
  providerFactory: ProviderFactory.create({}),
  portalProviderAPI,
  onEditorCreated: () => {},
  onEditorDestroyed: () => {},
  editorProps: {},
});
const analyticsProps = () => ({
  allowAnalyticsGASV3: true,
  createAnalyticsEvent: createAnalyticsEventMock() as any,
});
describe('ReactEditorView/reconfigureState', () => {
  let mockFire: ReturnType<typeof FireAnalyticsEvent.fireAnalyticsEvent>;
  beforeEach(() => {
    mockFire = jest.fn();
    jest
      .spyOn(FireAnalyticsEvent, 'fireAnalyticsEvent')
      .mockReturnValue(mockFire);
  });
  afterEach(() => {
    (FireAnalyticsEvent.fireAnalyticsEvent as jest.Mock).mockRestore();
    jest.resetAllMocks();
  });
  describe('when the component is created', () => {
    it('should send the feature flag', () => {
      mountWithIntl(
        <ReactEditorView
          {...requiredProps()}
          {...analyticsProps()}
          editorProps={{
            featureFlags: {
              useUnpredictableInputRule: true,
            },
          }}
        />,
      );
      expect(textFormattingInputRulePlugin).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        expect.objectContaining({ useUnpredictableInputRule: true }),
      );
    });
  });
  describe('when the editor props flag changes', () => {
    it('should reconfigure the state using new UNSAFE_allowUndoRedoButtons', () => {
      const wrapper = mountWithIntl(
        <ReactEditorView
          {...requiredProps()}
          {...analyticsProps()}
          editorProps={{
            UNSAFE_allowUndoRedoButtons: false,
          }}
        />,
      );
      wrapper.setProps({
        editorProps: {
          UNSAFE_allowUndoRedoButtons: true,
        },
      });
      expect(textFormattingInputRulePlugin).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
        expect.objectContaining({ undoRedoButtons: true }),
      );
      wrapper.unmount();
    });
  });
  describe('when the editor props flag changes on mobile appearance', () => {
    it('should reconfigure the state using the new feature flag', () => {
      const wrapper = mountWithIntl(
        <ReactEditorView
          {...requiredProps()}
          {...analyticsProps()}
          editorProps={{
            featureFlags: {
              useUnpredictableInputRule: true,
            },
            appearance: 'mobile',
          }}
        />,
      );
      wrapper.setProps({
        editorProps: {
          featureFlags: {
            useUnpredictableInputRule: false,
            appearance: 'mobile',
          },
        },
      });
      expect(textFormattingInputRulePlugin).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
        expect.objectContaining({ useUnpredictableInputRule: false }),
      );
      wrapper.unmount();
    });
  });
});
