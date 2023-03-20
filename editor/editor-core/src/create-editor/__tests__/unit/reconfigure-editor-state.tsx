jest.mock('../../../plugins/text-formatting/pm-plugins/input-rule');
import React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import ReactEditorView from '../../ReactEditorView';
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
import textFormattingInputRulePlugin from '../../../plugins/text-formatting/pm-plugins/input-rule';
import type { FireAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { fireAnalyticsEvent } from '@atlaskit/editor-common/analytics';

jest.mock('@atlaskit/editor-common/analytics', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common/analytics'),
  fireAnalyticsEvent: jest.fn(),
}));

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
  let mockFire: ReturnType<FireAnalyticsEvent>;
  beforeEach(() => {
    mockFire = jest.fn();
    (fireAnalyticsEvent as jest.Mock).mockReturnValue(mockFire);
  });
  afterEach(() => {
    (fireAnalyticsEvent as jest.Mock).mockRestore();
    jest.resetAllMocks();
  });
  describe('when the component is created', () => {
    it('should send the feature flag', () => {
      renderWithIntl(
        <ReactEditorView
          {...requiredProps()}
          {...analyticsProps()}
          editorProps={{
            featureFlags: {
              tableOverflowShadowsOptimization: true,
            },
          }}
        />,
      );
      expect(textFormattingInputRulePlugin).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        expect.objectContaining({ tableOverflowShadowsOptimization: true }),
      );
    });
  });
  describe('when the editor props flag changes', () => {
    it('should reconfigure the state using new allowUndoRedoButtons', () => {
      const { rerender, unmount } = renderWithIntl(
        <ReactEditorView
          {...requiredProps()}
          {...analyticsProps()}
          editorProps={{
            allowUndoRedoButtons: false,
          }}
        />,
      );
      rerender(
        <ReactEditorView
          {...requiredProps()}
          {...analyticsProps()}
          editorProps={{
            allowUndoRedoButtons: true,
          }}
        />,
      );
      expect(textFormattingInputRulePlugin).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
        expect.objectContaining({ undoRedoButtons: true }),
      );
      unmount();
    });
  });
  describe('when the editor props flag changes on mobile appearance', () => {
    it('should reconfigure the state using the new feature flag', () => {
      const { rerender, unmount } = renderWithIntl(
        <ReactEditorView
          {...requiredProps()}
          {...analyticsProps()}
          editorProps={{
            featureFlags: {
              tableOverflowShadowsOptimization: true,
            },
            appearance: 'mobile',
          }}
        />,
      );
      rerender(
        <ReactEditorView
          {...requiredProps()}
          {...analyticsProps()}
          editorProps={{
            featureFlags: {
              tableOverflowShadowsOptimization: false,
              appearance: 'mobile',
            },
          }}
        />,
      );
      expect(textFormattingInputRulePlugin).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
        expect.objectContaining({ tableOverflowShadowsOptimization: false }),
      );
      unmount();
    });
  });
});
