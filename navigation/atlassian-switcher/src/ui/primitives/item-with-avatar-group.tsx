import React from 'react';
import styled from 'styled-components';
import AvatarGroup from '@atlaskit/avatar-group';

import { JoinableSiteUserAvatarPropTypes } from '../../types';
import {
  createAndFireNavigationEvent,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
  UI_EVENT_TYPE,
  SWITCHER_ITEM_SUBJECT,
} from '../../common/utils/analytics';
import { FadeIn } from './fade-in';
import ThemedItem from './themed-item';

export interface ItemWithAvatarGroupProps extends WithAnalyticsEventsProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  description?: React.ReactNode;
  href?: string;
  isDisabled?: boolean;
  onKeyDown?: any;
  onItemClick?: Function;
  users?: JoinableSiteUserAvatarPropTypes[];
  target?: string;
  rel?: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  // make sure that it does not go beyond the navigation width
  // and always have the full width since we have avatars on the R.H.S.
  > div {
    width: 100%;
  }
`;

const noop = () => {};

class ItemWithAvatarGroup extends React.Component<ItemWithAvatarGroupProps> {
  render() {
    const { icon, description, users = [], onItemClick, ...rest } = this.props;

    return (
      <FadeIn>
        <Wrapper>
          <ThemedItem
            description={description}
            icon={icon}
            elemAfter={
              <AvatarGroup
                appearance="stack"
                data={users}
                maxCount={3}
                size="small"
                onMoreClick={noop}
              />
            }
            onClick={onItemClick}
            {...rest}
          />
        </Wrapper>
      </FadeIn>
    );
  }
}

export default withAnalyticsEvents({
  onItemClick: createAndFireNavigationEvent({
    eventType: UI_EVENT_TYPE,
    action: 'clicked',
    actionSubject: SWITCHER_ITEM_SUBJECT,
  }),
})(ItemWithAvatarGroup);
