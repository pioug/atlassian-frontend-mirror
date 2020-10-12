import { AvatarItem } from '@atlaskit/avatar';
import React from 'react';
import styled from 'styled-components';
import { Option } from '../types';
import { SizeableAvatar } from './SizeableAvatar';
import { getAvatarUrl } from './utils';

const AvatarItemComponent = styled.div`
  border: none !important;
  padding: 0 !important;
  width: auto;
  overflow: hidden;
  /* IE 11 needs this prop explicitly to flex items */
  flex: 1 1 auto;
  min-width: 100px;

  & > span {
    box-sizing: border-box;
  }

  &:hover {
    width: auto;
    padding: 0;
    border: none;
  }
`;

type Props = {
  data: Option;
  selectProps: any;
};

export const SingleValue = (props: Props) => {
  const {
    data: { label, data },
    selectProps: { appearance, isFocused },
  } = props;

  return !isFocused ? (
    <AvatarItem
      backgroundColor="transparent"
      avatar={
        <SizeableAvatar
          src={getAvatarUrl(data)}
          appearance={appearance}
          name={label}
        />
      }
      primaryText={label}
    >
      {({ ref, ...props }) => <AvatarItemComponent {...props} />}
    </AvatarItem>
  ) : null;
};
