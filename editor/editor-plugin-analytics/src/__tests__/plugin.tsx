import React from 'react';

import { render } from '@testing-library/react';

import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

import { analyticsPlugin } from '../plugin';
import { analyticsPluginKey } from '../plugin-key';

const mockCreateAnalyticsEvent = jest.fn();

jest.mock('@atlaskit/analytics-next', () => ({
  ...jest.requireActual('@atlaskit/analytics-next'),
  useAnalyticsEvents: () => ({
    createAnalyticsEvent: mockCreateAnalyticsEvent,
  }),
}));

function MountHook({ usePluginHook, editorView }: any) {
  usePluginHook({ editorView });
  return null;
}

describe('analytics plugin', () => {
  const createEditor = createProsemirrorEditorFactory();
  it('should not have `createAnalyticsEvent` if not rendering hook or passing', () => {
    const preset = new Preset<LightEditorPlugin>()
      .add([featureFlagsPlugin, {}])
      .add([analyticsPlugin, {}]);
    const { editorView } = createEditor({
      preset,
    });

    expect(
      analyticsPluginKey.getState(editorView.state).createAnalyticsEvent,
    ).toBe(undefined);
  });
  it('should use the passed createAnalyticsEvent to initialise `createAnalyticsEvent`', () => {
    const createAnalyticsEvent = jest.fn();
    const preset = new Preset<LightEditorPlugin>()
      .add([featureFlagsPlugin, {}])
      .add([analyticsPlugin, { createAnalyticsEvent }]);
    const { editorView, editorConfig } = createEditor({
      preset,
    });
    render(
      <MountHook
        usePluginHook={editorConfig.pluginHooks[0]}
        editorView={editorView}
      />,
    );
    expect(
      analyticsPluginKey.getState(editorView.state).createAnalyticsEvent,
    ).toBe(createAnalyticsEvent);
  });
  it('should use the `useAnalyticsEvents` to initialise `createAnalyticsEvent`', () => {
    const preset = new Preset<LightEditorPlugin>()
      .add([featureFlagsPlugin, {}])
      .add([analyticsPlugin, {}]);
    const { editorView, editorConfig } = createEditor({
      preset,
    });
    render(
      <MountHook
        usePluginHook={editorConfig.pluginHooks[0]}
        editorView={editorView}
      />,
    );
    expect(
      analyticsPluginKey.getState(editorView.state).createAnalyticsEvent,
    ).toBe(mockCreateAnalyticsEvent);
  });
  it('should update the `createAnalyticsEvent` on update', () => {
    const createAnalyticsEvent = jest.fn();

    let preset = new Preset<LightEditorPlugin>()
      .add([featureFlagsPlugin, {}])
      .add([analyticsPlugin, {}]);
    let { editorView, editorConfig } = createEditor({
      preset,
    });
    const { rerender } = render(
      <MountHook
        usePluginHook={editorConfig.pluginHooks[0]}
        editorView={editorView}
      />,
    );
    expect(
      analyticsPluginKey.getState(editorView.state).createAnalyticsEvent,
    ).toBe(mockCreateAnalyticsEvent);

    preset = new Preset<LightEditorPlugin>()
      .add([featureFlagsPlugin, {}])
      .add([analyticsPlugin, { createAnalyticsEvent }]);
    ({ editorConfig, editorView } = createEditor({
      preset,
    }));
    rerender(
      <MountHook
        usePluginHook={editorConfig.pluginHooks[0]}
        editorView={editorView}
      />,
    );
    expect(
      analyticsPluginKey.getState(editorView.state).createAnalyticsEvent,
    ).toBe(createAnalyticsEvent);
  });
});
