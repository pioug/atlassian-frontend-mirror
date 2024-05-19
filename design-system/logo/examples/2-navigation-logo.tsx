/** @jsx jsx */
import React, { Fragment, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { B500, DN10, N40, P300, Y300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import {
  AtlassianAccessIcon,
  AtlassianAdminIcon,
  AtlassianAdministrationIcon,
  AtlassianMarketplaceIcon,
  BitbucketIcon,
  CompassIcon,
  ConfluenceIcon,
  GuardIcon,
  HalpIcon,
  JiraIcon,
  JiraProductDiscoveryIcon,
  JiraServiceManagementIcon,
  JiraSoftwareIcon,
  JiraWorkManagementIcon,
  LoomIcon,
  OpsgenieIcon,
  RovoIcon,
  StatuspageIcon,
  TrelloIcon,
} from '../src';

const logoOptions = [
  AtlassianMarketplaceIcon,
  BitbucketIcon,
  CompassIcon,
  ConfluenceIcon,
  GuardIcon,
  HalpIcon,
  JiraIcon,
  JiraProductDiscoveryIcon,
  JiraServiceManagementIcon,
  JiraSoftwareIcon,
  JiraWorkManagementIcon,
  LoomIcon,
  OpsgenieIcon,
  RovoIcon,
  StatuspageIcon,
  TrelloIcon,
  AtlassianAdminIcon,
  AtlassianAdministrationIcon,
  AtlassianAccessIcon,
];

const iconVariants = [
  { background: B500, color: 'white' },
  { background: N40, color: DN10 },
  { background: P300, color: Y300 },
];

interface WrapperDivProps {
  color: string;
  background: string;
  children: ReactNode;
}

const wrapperDivStyles = css({
  display: 'flex',
  width: '40px',
  height: '40px',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--background)',
  borderRadius: token('border.radius.circle', '50%'),
  color: 'var(--color)',
  marginInlineEnd: token('space.250', '20px'),
});

const WrapperDiv = ({ color, background, children }: WrapperDivProps) => {
  return (
    <div
      css={wrapperDivStyles}
      style={
        { '--color': color, '--background': background } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};

const Wrapper = (props: WrapperDivProps) => (
  <Fragment>
    <WrapperDiv color={props.color} background={props.background}>
      {props.children}
    </WrapperDiv>
    <br />
  </Fragment>
);

export default () => (
  <Fragment>
    {logoOptions.map((Child, index) => (
      <div
        style={{ display: 'flex', marginBottom: token('space.250', '20px') }}
        key={index}
      >
        {iconVariants.map((pairing, index2) => (
          <Wrapper
            color={pairing.color}
            background={pairing.background}
            key={`${index}${index2}`}
          >
            <Child />
          </Wrapper>
        ))}
      </div>
    ))}
  </Fragment>
);
