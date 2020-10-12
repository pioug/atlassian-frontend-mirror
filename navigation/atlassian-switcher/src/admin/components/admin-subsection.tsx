import React, { FunctionComponent } from 'react';
import { SwitcherThemedItemWithEvents } from '../../ui/primitives';
import { SwitcherItemType } from '../../common/utils/links';
import {
  NavigationAnalyticsContext,
  getItemAnalyticsContext,
} from '../../common/utils/analytics';

interface AdminSubsectionProps {
  adminLinks: SwitcherItemType[];
}

export const AdminSubsection: FunctionComponent<AdminSubsectionProps> = ({
  adminLinks,
}) => {
  return (
    <>
      {adminLinks.map((item, groupIndex) => (
        <NavigationAnalyticsContext
          key={item.key}
          data={getItemAnalyticsContext(
            groupIndex,
            item.key,
            'admin',
            item.href,
          )}
        >
          <SwitcherThemedItemWithEvents
            icon={<item.Icon theme="admin" />}
            href={item.href}
          >
            {item.label}
          </SwitcherThemedItemWithEvents>
        </NavigationAnalyticsContext>
      ))}
    </>
  );
};
