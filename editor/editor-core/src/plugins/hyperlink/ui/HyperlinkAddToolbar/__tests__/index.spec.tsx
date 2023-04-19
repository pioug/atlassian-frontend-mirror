import React from 'react';

import HyperlinkAddToolbarWithProviderFactory from '../.';
import HyperlinkAddToolbar from '../HyperlinkAddToolbar';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { expectToEqual } from '@atlaskit/media-test-helpers/jestHelpers';
import { activityProviderMock, searchProviderMock } from './__helpers';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { MockLinkPickerPlugin } from '@atlaskit/link-test-helpers/link-picker';

import { INPUT_METHOD } from '../../../../analytics';
import { EditorLinkPicker } from '../../EditorLinkPicker';

describe('HyperlinkAddToolbar (with ProviderFactory prop)', () => {
  const createEditor = createEditorFactory();

  it('should use WithProviders such that all providers are passed to HyperlinkAddToolbar', () => {
    const { editorView } = createEditor({
      editorProps: {
        allowTables: true,
        allowStatus: true,
        allowDate: true,
        smartLinks: {},
      },
    });
    const onSubmit = jest.fn();
    const providerFactory = ProviderFactory.create({
      activityProvider: activityProviderMock,
      searchProvider: searchProviderMock,
    });
    const view = editorView;

    const component = mountWithIntl(
      <HyperlinkAddToolbarWithProviderFactory
        linkPickerOptions={{}}
        view={editorView}
        providerFactory={providerFactory}
        displayText={'some-display-text'}
        displayUrl={'some-display-url'}
        onSubmit={onSubmit}
        featureFlags={{}}
      />,
    );

    expect(component.find(EditorLinkPicker).exists()).toBe(false);
    expectToEqual(component.find(HyperlinkAddToolbar).props(), {
      onSubmit,
      displayUrl: 'some-display-url',
      displayText: 'some-display-text',
      activityProvider: activityProviderMock,
      searchProvider: searchProviderMock,
      pluginState: {
        activeLinkMark: undefined,
        activeText: undefined,
        canInsertLink: true,
        timesViewed: 0,
      },
      view,
    });
  });

  describe('when `lpLinkPicker` ff is `true`', () => {
    const featureFlags = {
      lpLinkPicker: true,
    };

    it('renders `EditorLinkPicker` and correctly passes all `linkPickerOptions`', () => {
      const onSubmit = jest.fn();
      const { editorView } = createEditor({});
      const providerFactory = ProviderFactory.create({});
      const plugins = [new MockLinkPickerPlugin()];

      const component = mountWithIntl(
        <HyperlinkAddToolbarWithProviderFactory
          linkPickerOptions={{ plugins }}
          view={editorView}
          providerFactory={providerFactory}
          displayText={'some-display-text'}
          displayUrl={'some-display-url'}
          onSubmit={onSubmit}
          featureFlags={featureFlags}
        />,
      );

      expect(component.find(HyperlinkAddToolbar).exists()).toBe(false);
      const props = component.find(EditorLinkPicker).props();
      expect(props).toStrictEqual(
        expect.objectContaining({
          displayText: 'some-display-text',
          url: 'some-display-url',
          plugins,
          view: editorView,
          onSubmit: expect.anything(),
        }),
      );
    });

    it('renders `EditorLinkPicker` with `onSubmit` that correctly maps arguments from link picker onSubmit payload', () => {
      const onSubmit = jest.fn();
      const { editorView } = createEditor({});
      const providerFactory = ProviderFactory.create({
        activityProvider: activityProviderMock,
        searchProvider: searchProviderMock,
      });
      const plugins = [new MockLinkPickerPlugin()];

      const component = mountWithIntl(
        <HyperlinkAddToolbarWithProviderFactory
          linkPickerOptions={{ plugins }}
          view={editorView}
          providerFactory={providerFactory}
          displayText={'some-display-text'}
          displayUrl={'some-display-url'}
          onSubmit={onSubmit}
          featureFlags={featureFlags}
        />,
      );

      const linkPickerOnSubmit = component
        .find(EditorLinkPicker)
        .prop('onSubmit');

      linkPickerOnSubmit({
        url: 'https://atlassian.com',
        title: 'Atlassian',
        displayText: 'The Atlassian Website',
        rawUrl: 'atlassian.com',
        meta: {
          inputMethod: 'manual',
        },
      });

      expect(onSubmit).toHaveBeenCalledWith(
        'https://atlassian.com',
        'Atlassian',
        'The Atlassian Website',
        INPUT_METHOD.MANUAL,
        undefined,
      );
    });
  });
});
