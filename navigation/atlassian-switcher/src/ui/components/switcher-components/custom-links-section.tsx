import React from 'react';
import {
  SwitcherThemedItemWithEvents,
  Section,
  FormattedMessage,
} from '../../primitives';
import { SwitcherItemType } from '../../../common/utils/links';
import {
  NavigationAnalyticsContext,
  getItemAnalyticsContext,
} from '../../../common/utils/analytics';
import messages from '../../../common/utils/messages';
import { Appearance } from '../../theme/types';

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
              'customLink',
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
