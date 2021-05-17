import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import AvatarGroup from '@atlaskit/avatar-group';
import { N0, N40 } from '@atlaskit/theme/colors';

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
  highlighted?: boolean;
}

const BORDER_RADIUS = '3px';

const pulseAnimation = keyframes`
    0% {
      transform: scale(1);
      opacity: 1;
    }
    67% {
      transform: scale(1.02857, 1.17021);
      opacity: 0.67;
    }
    100% {
      transform: scale(1.02857, 1.17021);
      opacity: 0;
    }
`;

const highlightStyles = css`
  position: relative;
  border-radius: ${BORDER_RADIUS};

  &::before,
  &::after {
    content: '';
    box-sizing: border-box;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    border-radius: ${BORDER_RADIUS};
  }

  &::before {
    z-index: -1;
    background-color: ${N0};
    border: 1px solid ${N40};
  }

  &::after {
    z-index: -2;
    background-color: ${N40};
    transform-origin: center;
    animation: ${pulseAnimation} 1.5s ease-out infinite;
  }
`;

const Wrapper = styled.div<{ highlighted?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  // make sure that it does not go beyond the navigation width
  // and always have the full width since we have avatars on the R.H.S.
  > div {
    width: 100%;
  }

  ${({ highlighted }) => highlighted && highlightStyles}
`;

const noop = () => {};

class ItemWithAvatarGroup extends React.Component<ItemWithAvatarGroupProps> {
  render() {
    const {
      icon,
      description,
      users = [],
      onItemClick,
      highlighted,
      ...rest
    } = this.props;

    return (
      <FadeIn>
        <Wrapper highlighted={highlighted}>
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
