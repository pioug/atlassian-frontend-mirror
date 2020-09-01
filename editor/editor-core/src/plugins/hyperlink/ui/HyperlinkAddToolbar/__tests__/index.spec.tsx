import React from 'react';

import HyperlinkAddToolbarWithProviderFactory from '../.';
import HyperlinkAddToolbar from '../HyperlinkAddToolbar';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { expectToEqual } from '@atlaskit/media-test-helpers/jestHelpers';
import { activityProviderMock, searchProviderMock } from './__helpers';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';

describe('HyperlinkAddToolbar (with ProviderFactory prop)', () => {
  it('should use WithProviders such that all providers are passed to HyperlinkAddToolbar', () => {
    const onBlur = jest.fn();
    const onSubmit = jest.fn();
    const providerFactory = ProviderFactory.create({
      activityProvider: activityProviderMock,
      searchProvider: searchProviderMock,
    });

    const component = mountWithIntl(
      <HyperlinkAddToolbarWithProviderFactory
        providerFactory={providerFactory}
        displayText={'some-display-text'}
        displayUrl={'some-display-url'}
        onBlur={onBlur}
        onSubmit={onSubmit}
      />,
    );
    expectToEqual(component.find(HyperlinkAddToolbar).props(), {
      onSubmit,
      onBlur,
      displayUrl: 'some-display-url',
      displayText: 'some-display-text',
      activityProvider: activityProviderMock,
      searchProvider: searchProviderMock,
    });
  });
});
