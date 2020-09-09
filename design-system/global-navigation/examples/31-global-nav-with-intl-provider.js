import React, { Component } from 'react';
import { IntlProvider, addLocaleData } from 'react-intl';
import es from 'react-intl/locale-data/es';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';
import { AnalyticsListener } from '@atlaskit/analytics-next';

import GlobalNavigation from '../src';

addLocaleData([...es]);

const getGlobalNavigation = () => (
  <AnalyticsListener
    channel="navigation"
    onEvent={analyticsEvent => {
      const { payload, context } = analyticsEvent;
      const eventId = `${payload.actionSubject || payload.name} ${
        payload.action || payload.eventType
      }`;
      console.log(`Received event [${eventId}]: `, {
        payload,
        context,
      });
    }}
  >
    <GlobalNavigation
      product="jira"
      cloudId="some-cloud-id"
      productIcon={EmojiAtlassianIcon}
    />
  </AnalyticsListener>
);

export default class extends Component {
  render() {
    return (
      <IntlProvider locale="es">
        <NavigationProvider>
          <LayoutManager
            globalNavigation={getGlobalNavigation}
            productNavigation={() => null}
            containerNavigation={() => null}
          >
            <span>Global nav with intl provider</span>
          </LayoutManager>
        </NavigationProvider>
      </IntlProvider>
    );
  }
}
