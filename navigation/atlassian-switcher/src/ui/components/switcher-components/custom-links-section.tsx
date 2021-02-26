import React from 'react';
import {
  FormattedMessage,
  Section,
  SwitcherThemedItemWithEvents,
} from '../../primitives';
import { SwitcherItemType } from '../../../common/utils/links';
import {
  getItemAnalyticsContext,
  NavigationAnalyticsContext,
} from '../../../common/utils/analytics';
import messages from '../../../common/utils/messages';
import { Appearance } from '../../theme/types';
import { AnalyticsItemType } from '../../../types';

export type CustomLinkSectionProps = {
  appearance?: Appearance;
  customLinks: SwitcherItemType[];
};

export const CustomLinksSection = ({
  appearance,
  customLinks,
}: CustomLinkSectionProps) => {
  return (
    <Section
      sectionId="customLinks"
      title={<FormattedMessage {...messages.more} />}
      appearance={appearance}
    >
      {customLinks.map(
        ({ analyticsAttributes, label, href, Icon }, groupIndex) => (
          // todo: id in SwitcherItem should be consumed from custom link resolver
          <NavigationAnalyticsContext
            key={groupIndex + '.' + label}
            data={getItemAnalyticsContext(
              groupIndex,
              null,
              AnalyticsItemType.CUSTOM_LINK,
              undefined,
              analyticsAttributes,
            )}
          >
            <SwitcherThemedItemWithEvents
              icon={<Icon theme="custom" />}
              href={href}
            >
              {label}
            </SwitcherThemedItemWithEvents>
          </NavigationAnalyticsContext>
        ),
      )}
    </Section>
  );
};
