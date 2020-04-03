import React, { Fragment } from 'react';
import { colors } from '@atlaskit/theme';
import styled from 'styled-components';

import {
  BitbucketIcon,
  ConfluenceIcon,
  JiraCoreIcon,
  JiraIcon,
  JiraServiceDeskIcon,
  JiraSoftwareIcon,
  OpsGenieIcon,
  StrideIcon,
  StatuspageIcon,
  TrelloIcon,
} from '../src';

const logoOptions = [
  BitbucketIcon,
  ConfluenceIcon,
  JiraCoreIcon,
  JiraIcon,
  JiraServiceDeskIcon,
  JiraSoftwareIcon,
  OpsGenieIcon,
  StrideIcon,
  StatuspageIcon,
  TrelloIcon,
];

const iconVariants = [
  { background: colors.B500, color: 'white' },
  { background: colors.N40, color: colors.DN10 },
  { background: colors.P300, color: colors.Y300 },
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
