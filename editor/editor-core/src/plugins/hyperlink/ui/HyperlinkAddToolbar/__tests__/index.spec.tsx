import React from 'react';

import HyperlinkAddToolbarWithProviderFactory from '../.';
import HyperlinkAddToolbar from '../HyperlinkAddToolbar';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { expectToEqual } from '@atlaskit/media-test-helpers/jestHelpers';
import { activityProviderMock, searchProviderMock } from './__helpers';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';

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
        view={editorView}
        providerFactory={providerFactory}
        displayText={'some-display-text'}
        displayUrl={'some-display-url'}
        onSubmit={onSubmit}
      />,
    );
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
});
