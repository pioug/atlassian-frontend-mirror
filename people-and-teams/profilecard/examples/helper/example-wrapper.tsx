import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener, type UIAnalyticsEvent } from '@atlaskit/analytics-next';

const onAnalyticsEvent = (event: UIAnalyticsEvent) => {
  console.log(
    event.payload.action,
    event.payload.actionSubject,
    event.payload.actionSubjectId || '',
    event.payload.attributes,
  );
};

type Props = {
  locale?: string;
  children: React.ReactNode;
};

const ExampleWrapper = (props: Props) => {
  const { locale = 'en', children } = props;

  return (
    <AnalyticsListener channel="peopleTeams" onEvent={onAnalyticsEvent}>
      <IntlProvider key={locale} locale={locale}>
        {children}
      </IntlProvider>
    </AnalyticsListener>
  );
};

export default ExampleWrapper;
