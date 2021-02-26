import React from 'react';
import {
  FormattedMessage,
  Section,
  SwitcherThemedItemWithEvents,
} from '../../primitives';
import messages from '../../../common/utils/messages';
import { RecentItemType } from '../../../common/utils/links';
import {
  getItemAnalyticsContext,
  NavigationAnalyticsContext,
} from '../../../common/utils/analytics';
import { Appearance } from '../../theme/types';
import { AnalyticsItemType } from '../../../types';

type RecentSectionProps = {
  appearance?: Appearance;
  recentLinks: RecentItemType[];
};

export const RecentSection = ({
  appearance,
  recentLinks,
}: RecentSectionProps) => {
  return (
    <Section
      sectionId="recent"
      title={<FormattedMessage {...messages.recent} />}
      appearance={appearance}
    >
      {recentLinks.map(
        ({ key, label, href, type, description, Icon }, groupIndex) => (
          <NavigationAnalyticsContext
            key={key}
            data={getItemAnalyticsContext(
              groupIndex,
              type,
              AnalyticsItemType.RECENT,
            )}
          >
            <SwitcherThemedItemWithEvents
              icon={<Icon theme="recent" />}
              description={description}
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
