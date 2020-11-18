import React, { FunctionComponent } from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import messages from '../../common/utils/messages';
import {
  Section,
  SwitcherThemedItemWithEvents,
  FormattedMessage,
} from '../../ui/primitives';
import { SwitcherItemType } from '../../common/utils/links';
import { Appearance } from '../../ui/theme/types';
import {
  SyntheticProviderResults,
  ProviderResults,
  TriggerXFlowCallback,
  DiscoverMoreCallback,
} from '../../types';
import {
  NavigationAnalyticsContext,
  getItemAnalyticsContext,
} from '../../common/utils/analytics';
import { CrossFlowSubsection } from './cross-flow-subsection';

interface CrossFlowSectionProps {
  appearance?: Appearance;
  onClose?: () => void;
  rawProviderResults: ProviderResults & SyntheticProviderResults;
  suggestedProductLinks: SwitcherItemType[];
  triggerXFlow: TriggerXFlowCallback;
  discoverSectionLinks: SwitcherItemType[];
  onDiscoverMoreClicked: DiscoverMoreCallback;
  isSlackDiscoveryEnabled?: boolean;
  slackDiscoveryClickHandler?: DiscoverMoreCallback;
}

const noop = () => {};

export const CrossFlowSection: FunctionComponent<CrossFlowSectionProps> = props => {
  const {
    appearance,
    discoverSectionLinks,
    onDiscoverMoreClicked,
    suggestedProductLinks,
    isSlackDiscoveryEnabled,
    slackDiscoveryClickHandler,
  } = props;

  return (
    <Section
      sectionId="discover"
      title={<FormattedMessage {...messages.discover} />}
      appearance={appearance}
    >
      {suggestedProductLinks.length > 0 && (
        <CrossFlowSubsection
          {...props}
          itemShowDescription
          itemTheme="recommendedProduct"
          showFirstLozengeOnly
        />
      )}
      {discoverSectionLinks.map((item, groupIndex) => (
        <NavigationAnalyticsContext
          key={item.key}
          data={getItemAnalyticsContext(
            groupIndex,
            item.key,
            'discover-fixed-links',
            item.href,
          )}
        >
          <SwitcherThemedItemWithEvents
            icon={<item.Icon theme="discover" />}
            href={item.href}
            description={item.description}
            onClick={
              item.href
                ? noop
                : (event: any, analyticsEvent: UIAnalyticsEvent) => {
                    if (
                      item.key === 'slack-integration' &&
                      isSlackDiscoveryEnabled &&
                      slackDiscoveryClickHandler
                    ) {
                      slackDiscoveryClickHandler(
                        event,
                        analyticsEvent,
                        item.key,
                      );
                    } else {
                      onDiscoverMoreClicked(event, analyticsEvent, item.key);
                    }
                  }
            }
          >
            {item.label}
          </SwitcherThemedItemWithEvents>
        </NavigationAnalyticsContext>
      ))}
    </Section>
  );
};
