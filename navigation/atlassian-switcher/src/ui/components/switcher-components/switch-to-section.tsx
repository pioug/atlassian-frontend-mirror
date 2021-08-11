import React, { useCallback, useRef } from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  FormattedMessage,
  Section,
  SectionWithLinkItem,
  SwitcherItemWithDropdown,
  SwitcherThemedItemWithEvents,
  NotificationDot,
  TryLozenge,
} from '../../primitives';
import messages from '../../../common/utils/messages';
import { SwitcherItemType } from '../../../common/utils/links';
import {
  getItemAnalyticsContext,
  NavigationAnalyticsContext,
} from '../../../common/utils/analytics';
import { Appearance } from '../../theme/types';
import {
  AnalyticsItemType,
  DiscoverLinkItemKeys,
  DiscoverMoreCallback,
  GetExtendedAnalyticsAttributes,
  SwitcherProductType,
  WithRecommendationsFeatureFlags,
  WithConfluenceNotificationDot,
} from '../../../types';
import { AdminSubsection } from '../../../admin/components/admin-subsection';

const noop = () => void 0;
const DOT_CHASING_FLAG =
  'jira.frontend.growth.experiments.switcher.dot.chasing';

type SwitchToSectionProps = {
  adminLinks: SwitcherItemType[];
  appearance?: Appearance;
  disableHeading?: boolean;
  showStartLink?: boolean;
  showNewHeading?: boolean;
  fixedLinks: SwitcherItemType[];
  licensedProductLinks: SwitcherItemType[];
  onDiscoverMoreClicked: DiscoverMoreCallback;
  getExtendedAnalyticsAttributes: GetExtendedAnalyticsAttributes;
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
  licensedProductLinks,
  onDiscoverMoreClicked,
  getExtendedAnalyticsAttributes,
  recommendationsFeatureFlags,
  switcherConfluenceNotificationDot,
}: Partial<WithConfluenceNotificationDot> &
  Partial<WithRecommendationsFeatureFlags> &
  SwitchToSectionProps) => {
  const switcherConfluenceRef = useRef(switcherConfluenceNotificationDot);
  const dotChasingFlagValue = recommendationsFeatureFlags?.[
    DOT_CHASING_FLAG
  ] as string;

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

  const onDotChasingClickedCallback = useCallback(() => {
    switcherConfluenceRef.current?.setConfluenceLinkClicked();
  }, []);

  const isDotChasingExperiment = useCallback(
    (productType?: SwitcherProductType): boolean => {
      switcherConfluenceRef.current?.setSwitcherNotificationDot();
      return (
        ['variation1', 'variation2', 'variation3'].includes(
          dotChasingFlagValue,
        ) && productType === SwitcherProductType.CONFLUENCE
      );
    },
    [dotChasingFlagValue],
  );

  const shouldShowNotificationDot = useCallback((): boolean => {
    return (
      !!switcherConfluenceRef.current &&
      switcherConfluenceRef.current.showConfluenceNotificationDot
    );
  }, []);

  const shouldLinkToEditor = useCallback((): boolean => {
    return (
      !!switcherConfluenceRef.current &&
      switcherConfluenceRef.current.linkToConfluenceEditor
    );
  }, []);

  const renderChildren = () => {
    return [
      licensedProductLinks.map((item, groupIndex) => (
        <NavigationAnalyticsContext
          key={item.key}
          data={getItemAnalyticsContext(
            groupIndex,
            null,
            AnalyticsItemType.PRODUCT,
            item.productType,
            getExtendedAnalyticsAttributes(item.productType),
          )}
        >
          {isDotChasingExperiment(item.productType) ? (
            <SwitcherItemWithDropdown
              icon={
                shouldShowNotificationDot() ? (
                  <NotificationDot>
                    <item.Icon theme="highlightedProduct" />
                  </NotificationDot>
                ) : (
                  <item.Icon theme="product" />
                )
              }
              childIcon={<item.Icon theme="subtle" />}
              description={
                shouldShowNotificationDot()
                  ? 'Document Collaboration'
                  : item.description
              }
              href={
                shouldLinkToEditor()
                  ? '/wiki/welcome?createBlankFabricPage=true'
                  : item.href
              }
              onItemClick={onDotChasingClickedCallback}
              shouldShowNotificationDot={shouldShowNotificationDot()}
              childItems={item.childItems}
              tooltipContent={<FormattedMessage {...messages.showMoreSites} />}
            >
              {item.label}
              {shouldShowNotificationDot() && (
                <TryLozenge isBold={false}>
                  <FormattedMessage {...messages.free} />
                </TryLozenge>
              )}
            </SwitcherItemWithDropdown>
          ) : (
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
          )}
        </NavigationAnalyticsContext>
      )),
      fixedLinks.map((item, groupIndex) => (
        <NavigationAnalyticsContext
          key={item.key}
          data={getItemAnalyticsContext(
            groupIndex,
            item.key,
            AnalyticsItemType.PRODUCT,
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
