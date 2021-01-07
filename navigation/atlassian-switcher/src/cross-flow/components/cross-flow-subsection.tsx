import React, { FunctionComponent } from 'react';
import { SwitcherItemType } from '../../common/utils/links';
import {
  NavigationAnalyticsContext,
  getItemAnalyticsContext,
} from '../../common/utils/analytics';
import messages from '../../common/utils/messages';

import {
  SwitcherThemedItemWithEvents,
  TryLozenge,
  FormattedMessage,
} from '../../ui/primitives';
import UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { TriggerXFlowCallback } from '../../types';

interface CrossFlowSubsection {
  suggestedProductLinks: SwitcherItemType[];
  triggerXFlow: TriggerXFlowCallback;
  itemShowDescription?: boolean;
  itemTheme?: string;
  showFirstLozengeOnly?: boolean;
}

export const CrossFlowSubsection: FunctionComponent<CrossFlowSubsection> = ({
  suggestedProductLinks,
  triggerXFlow,
  itemShowDescription = false,
  itemTheme = 'product',
  showFirstLozengeOnly = false,
}) => {
  const onRecommendedProductClick = (key: string) => (
    event: any,
    analyticsEvent: UIAnalyticsEvent,
  ) => {
    triggerXFlow(key, 'atlassian-switcher', event, analyticsEvent);
  };
  return (
    <>
      {suggestedProductLinks.map((item, groupIndex) => (
        <NavigationAnalyticsContext
          key={item.key}
          data={getItemAnalyticsContext(groupIndex, item.key, 'try')}
        >
          <SwitcherThemedItemWithEvents
            icon={<item.Icon theme={itemTheme} />}
            description={itemShowDescription && item.description}
            // deprecated — recommended products should be restricted to a single line
            shouldAllowMultiline={itemShowDescription}
            onClick={onRecommendedProductClick(item.key)}
          >
            {item.label}
            {showFirstLozengeOnly && groupIndex === 0 && (
              <TryLozenge isBold={false}>
                <FormattedMessage {...messages.try} />
              </TryLozenge>
            )}
            {!showFirstLozengeOnly && (
              <TryLozenge>
                <FormattedMessage {...messages.try} />
              </TryLozenge>
            )}
          </SwitcherThemedItemWithEvents>
        </NavigationAnalyticsContext>
      ))}
    </>
  );
};
