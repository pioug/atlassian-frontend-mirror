import React, { useCallback } from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  SwitcherThemedItemWithEvents,
  SwitcherItemWithDropdown,
  Section,
  SectionWithLinkItem,
  FormattedMessage,
} from '../../primitives';
import messages from '../../../common/utils/messages';
import { SwitcherItemType } from '../../../common/utils/links';
import {
  NavigationAnalyticsContext,
  getItemAnalyticsContext,
} from '../../../common/utils/analytics';
import { Appearance } from '../../theme/types';
import {
  TriggerXFlowCallback,
  DiscoverMoreCallback,
  DiscoverLinkItemKeys,
} from '../../../types';
import { AdminSubsection } from '../../../admin/components/admin-subsection';
import { CrossFlowSubsection } from '../../../cross-flow/components/cross-flow-subsection';

const noop = () => void 0;

type SwitchToSectionProps = {
  adminLinks: SwitcherItemType[];
  appearance?: Appearance;
  disableHeading?: boolean;
  showStartLink?: boolean;
  showNewHeading?: boolean;
  fixedLinks: SwitcherItemType[];
  isDiscoverSectionEnabled?: boolean;
  licensedProductLinks: SwitcherItemType[];
  onDiscoverMoreClicked: DiscoverMoreCallback;
  suggestedProductLinks: SwitcherItemType[];
  triggerXFlow: TriggerXFlowCallback;
};

const START_LINK_ITEM: SwitcherItemType = {
  key: 'atlassian-start',
  label: <FormattedMessage {...messages.atlassianStart} />,
  Icon: () => null,
  href: 'https://start.atlassian.com',
};

export const SwitchToSection = ({
  adminLinks,
  appearance,
  showStartLink,
  showNewHeading,
  disableHeading,
  fixedLinks,
  isDiscoverSectionEnabled,
  licensedProductLinks,
  onDiscoverMoreClicked,
  suggestedProductLinks,
  triggerXFlow,
}: SwitchToSectionProps) => {
  /** https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/6522/issue-prst-13-adding-discover-more-button/
   * Currently Atlaskit's Item prioritises the usage of href over onClick in the case the href is a valid value.
   *
   *  The Discover more link is rendered with href=”” and onClick={actualImplementation}. Because the value of
   *  href is not valid for this case the item will instead call the onClick callback provided.
   *  */
  const onDiscoverMoreClickedCallback = useCallback(
    (event: any, analyticsEvent: UIAnalyticsEvent) => {
      onDiscoverMoreClicked(event, analyticsEvent);
    },
    [onDiscoverMoreClicked],
  );

  const renderChildren = () => {
    return [
      licensedProductLinks.map((item, groupIndex) => (
        <NavigationAnalyticsContext
          key={item.key}
          data={getItemAnalyticsContext(
            groupIndex,
            item.key,
            'product',
            item.href,
            item.productType,
          )}
        >
          <SwitcherItemWithDropdown
            icon={<item.Icon theme="product" />}
            childIcon={<item.Icon theme="subtle" />}
            description={item.description}
            href={item.href}
            childItems={item.childItems}
            tooltipContent={<FormattedMessage {...messages.showMoreSites} />}
          >
            {item.label}
          </SwitcherItemWithDropdown>
        </NavigationAnalyticsContext>
      )),
      !isDiscoverSectionEnabled && suggestedProductLinks.length > 0 && (
        <CrossFlowSubsection
          key="xflow-item"
          suggestedProductLinks={suggestedProductLinks}
          triggerXFlow={triggerXFlow}
        />
      ),
      fixedLinks.map((item, groupIndex) => (
        <NavigationAnalyticsContext
          key={item.key}
          data={getItemAnalyticsContext(
            groupIndex,
            item.key,
            'product',
            item.href,
          )}
        >
          <SwitcherThemedItemWithEvents
            icon={<item.Icon theme="product" />}
            href={item.href}
            onClick={
              item.key === DiscoverLinkItemKeys.DISCOVER_MORE
                ? onDiscoverMoreClickedCallback
                : noop
            }
          >
            {item.label}
          </SwitcherThemedItemWithEvents>
        </NavigationAnalyticsContext>
      )),
      adminLinks.length > 0 && (
        <AdminSubsection key="admin-item" adminLinks={adminLinks} />
      ),
    ];
  };
  return showNewHeading ? (
    <SectionWithLinkItem
      sectionId="switchTo"
      title={
        disableHeading ? null : <FormattedMessage {...messages.switchTo} />
      }
      titleLink={showStartLink ? START_LINK_ITEM : undefined}
      actionSubject="atlassianLink"
    >
      {renderChildren()}
    </SectionWithLinkItem>
  ) : (
    <Section
      sectionId="switchTo"
      title={
        disableHeading ? null : <FormattedMessage {...messages.switchTo} />
      }
      appearance={appearance}
    >
      {renderChildren()}
    </Section>
  );
};
