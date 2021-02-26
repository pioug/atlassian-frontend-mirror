import React, { FunctionComponent } from 'react';
import { SwitcherThemedItemWithEvents } from '../../ui/primitives';
import { SwitcherItemType } from '../../common/utils/links';
import {
  getItemAnalyticsContext,
  NavigationAnalyticsContext,
} from '../../common/utils/analytics';
import { AnalyticsItemType } from '../../types';

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
            AnalyticsItemType.ADMIN,
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
