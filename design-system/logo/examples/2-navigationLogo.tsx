import React, { Fragment } from 'react';

import styled from 'styled-components';

import { B500, DN10, N40, P300, Y300 } from '@atlaskit/theme/colors';

import {
  BitbucketIcon,
  ConfluenceIcon,
  JiraCoreIcon,
  JiraIcon,
  JiraServiceManagementIcon,
  JiraSoftwareIcon,
  OpsGenieIcon,
  StatuspageIcon,
  StrideIcon,
  TrelloIcon,
} from '../src';

const logoOptions = [
  BitbucketIcon,
  ConfluenceIcon,
  JiraCoreIcon,
  JiraIcon,
  JiraServiceManagementIcon,
  JiraSoftwareIcon,
  OpsGenieIcon,
  StrideIcon,
  StatuspageIcon,
  TrelloIcon,
];

const iconVariants = [
  { background: B500, color: 'white' },
  { background: N40, color: DN10 },
  { background: P300, color: Y300 },
];

interface WrapperDivProps {
  color: string;
  background: string;
}

const WrapperDiv = styled.div<WrapperDivProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  margin-right: 20px;
  color: ${props => props.color};
  background: ${props => props.background};
`;
/* eslint-disable */
const Wrapper: React.FC<WrapperDivProps> = props => (
  <Fragment>
    <WrapperDiv {...props}>{props.children}</WrapperDiv>
    <br />
  </Fragment>
);

export default () => (
  <Fragment>
    {logoOptions.map((Child, index) => (
      <div style={{ display: 'flex', marginBottom: '20px' }} key={index}>
        {iconVariants.map((pairing, index2) => (
          <Wrapper {...pairing} key={`${index}${index2}`}>
            <Child />
          </Wrapper>
        ))}
      </div>
    ))}
  </Fragment>
);
