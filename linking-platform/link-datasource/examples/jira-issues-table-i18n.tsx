import React, { useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';
import LocaleSelect, { Locale } from '@atlaskit/locale/LocaleSelect';

import { ExampleJiraIssuesTableView } from '../examples-helpers/buildJiraIssuesTable';
import SmartLinkClient from '../examples-helpers/smartLinkCustomClient';
export default () => {
  const [locale, setLocale] = useState('en');

  return (
    <IntlProvider defaultLocale="en" locale={locale}>
      <LocaleSelect
        onLocaleChange={(locale: Locale) => setLocale(locale.value)}
      />
      <SmartCardProvider client={new SmartLinkClient()}>
        <ExampleJiraIssuesTableView />
      </SmartCardProvider>
    </IntlProvider>
  );
};
