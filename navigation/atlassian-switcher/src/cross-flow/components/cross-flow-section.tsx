import React, { FunctionComponent } from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import messages from '../../common/utils/messages';
import {
  FormattedMessage,
  Section,
  SwitcherThemedItemWithEvents,
} from '../../ui/primitives';
import { SwitcherItemType } from '../../common/utils/links';
import { Appearance } from '../../ui/theme/types';
import {
  AnalyticsItemType,
  DiscoverMoreCallback,
  ProviderResults,
  SyntheticProviderResults,
  TriggerXFlowCallback,
} from '../../types';
import {
  getItemAnalyticsContext,
  NavigationAnalyticsContext,
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
}

const noop = () => {};

export const CrossFlowSection: FunctionComponent<CrossFlowSectionProps> = props => {
  const {
    appearance,
    discoverSectionLinks,
    onDiscoverMoreClicked,
    suggestedProductLinks,
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
            AnalyticsItemType.DISCOVER_FIXED_LINKS,
          )}
        >
          <SwitcherThemedItemWithEvents
            icon={<item.Icon theme="discover" />}
            href={item.href}
            target={item.target ? item.target : undefined}
            description={item.description}
            onClick={
              item.href
                ? noop
                : (event: any, analyticsEvent: UIAnalyticsEvent) =>
                    onDiscoverMoreClicked(event, analyticsEvent, item.key)
            }
          >
            {item.label}
          </SwitcherThemedItemWithEvents>
        </NavigationAnalyticsContext>
      ))}
    </Section>
  );
};
