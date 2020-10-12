import React from 'react';
import styled from 'styled-components';
import AkItem from '@atlaskit/item';
import { WithAnalyticsEventsProps } from '../../common/utils/analytics';
import { FadeIn } from './fade-in';

export interface SwitcherItemProps extends WithAnalyticsEventsProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  description?: React.ReactNode;
  elemAfter?: React.ReactNode;
  onClick?: Function;
  href?: string;
  target?: string;
  isDisabled?: boolean;
  onKeyDown?: any;
  shouldAllowMultiline?: boolean;
}

const StyledItem = styled(AkItem)`
  align-items: flex-start !important;
  & > span > span {
    white-space: normal;
  }
`;

export default class SwitcherItem extends React.Component<SwitcherItemProps> {
  render() {
    const {
      icon,
      description,
      elemAfter,
      shouldAllowMultiline,
      ...rest
    } = this.props;
    const Item = shouldAllowMultiline ? StyledItem : AkItem;
    return (
      <FadeIn>
        <Item
          description={description}
          elemBefore={icon}
          elemAfter={elemAfter}
          {...rest}
        />
      </FadeIn>
    );
  }
}
