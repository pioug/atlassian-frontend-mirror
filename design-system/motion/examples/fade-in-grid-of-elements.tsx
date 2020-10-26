/** @jsx jsx */
import { cloneElement, useState } from 'react';

import { jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import {
  BitbucketIcon,
  ConfluenceIcon,
  JiraCoreIcon,
  JiraIcon,
  JiraServiceDeskIcon,
  JiraSoftwareIcon,
  OpsGenieIcon,
  StatuspageIcon,
  StrideIcon,
} from '@atlaskit/logo';

import { Block, RetryContainer } from '../examples-utils';
import { FadeIn, StaggeredEntrance } from '../src';

const logos = [
  <BitbucketIcon size="xlarge" />,
  <ConfluenceIcon size="xlarge" />,
  <JiraCoreIcon size="xlarge" />,
  <JiraIcon size="xlarge" />,
  <JiraServiceDeskIcon size="xlarge" />,
  <JiraSoftwareIcon size="xlarge" />,
  <OpsGenieIcon size="xlarge" />,
  <StrideIcon size="xlarge" />,
  <StatuspageIcon size="xlarge" />,
];

export default () => {
  const [state, setState] = useState(() => ({
    size: 'medium' as any,
    numOfChildren: 9,
  }));

  return (
    <div>
      <div css={{ textAlign: 'center', '> *': { margin: '2px' } }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 50, 80].map(num => (
          <Button
            key={num}
            isSelected={num === state.numOfChildren}
            onClick={() => {
              setState({
                size: num > 9 ? 'small' : 'medium',
                numOfChildren: num,
              });
            }}
          >
            {num}
          </Button>
        ))}
      </div>

      <RetryContainer key={state.numOfChildren}>
        <ul
          css={{
            display: 'flex',
            maxWidth: '474px',
            flexWrap: 'wrap',
            padding: 0,
            justifyContent: 'flex-start',
            margin: '16px auto !important',
            div: { margin: '0' },
          }}
        >
          <StaggeredEntrance columns="responsive">
            {Array(state.numOfChildren)
              .fill(undefined)
              .map((_, index) => (
                <FadeIn key={index}>
                  {props => (
                    <li
                      {...props}
                      css={{ display: 'block', padding: 0, margin: '4px' }}
                    >
                      <Block appearance={state.size}>
                        {cloneElement(logos[index % logos.length], {
                          size: state.numOfChildren > 9 ? 'small' : 'xlarge',
                        })}
                      </Block>
                    </li>
                  )}
                </FadeIn>
              ))}
          </StaggeredEntrance>
        </ul>
      </RetryContainer>
    </div>
  );
};
