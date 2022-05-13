/** @jsx jsx */
import React, { Fragment } from 'react';

import { css, jsx } from '@emotion/core';

import { B500, DN10, N40, P300, Y300 } from '@atlaskit/theme/colors';

import {
  BitbucketIcon,
  CompassIcon,
  ConfluenceIcon,
  HalpIcon,
  JiraIcon,
  JiraServiceManagementIcon,
  JiraSoftwareIcon,
  JiraWorkManagementIcon,
  OpsgenieIcon,
  StatuspageIcon,
  TrelloIcon,
} from '../src';

const logoOptions = [
  BitbucketIcon,
  CompassIcon,
  ConfluenceIcon,
  HalpIcon,
  JiraIcon,
  JiraServiceManagementIcon,
  JiraSoftwareIcon,
  JiraWorkManagementIcon,
  OpsgenieIcon,
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

const wrapperDivStyles = css({
  display: 'flex',
  width: '40px',
  height: '40px',
  marginRight: '20px',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--background)',
  borderRadius: '50%',
  color: 'var(--color)',
});

const WrapperDiv: React.FC<WrapperDivProps> = ({
  color,
  background,
  ...rest
}) => {
  return (
    <div
      css={wrapperDivStyles}
      style={
        { '--color': color, '--background': background } as React.CSSProperties
      }
      {...rest}
    />
  );
};

const Wrapper: React.FC<WrapperDivProps> = (props) => (
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
