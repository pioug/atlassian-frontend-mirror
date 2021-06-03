/** @jsx jsx */
import { useState } from 'react';

import { jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import {
  BitbucketIcon,
  ConfluenceIcon,
  JiraServiceManagementIcon,
  JiraSoftwareIcon,
  OpsgenieIcon,
  StatuspageIcon,
} from '@atlaskit/logo';

import { Block, RetryContainer } from '../examples-utils';
import { ExitingPersistence, FadeIn, StaggeredEntrance } from '../src';

const Card = ({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: React.ReactNode;
}) => (
  <FadeIn>
    {(props) => (
      <li {...props} css={{ display: 'block', padding: 0, margin: '8px' }}>
        <Block
          css={{
            width: '100%',
            height: '48px',
            borderRadius: '3px',
          }}
        >
          <div
            css={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '8px',
            }}
          >
            {icon}
            <h3
              css={{
                margin: 0,
                fontWeight: 300,
                marginLeft: '8px',
              }}
            >
              {text}
            </h3>
          </div>
        </Block>
      </li>
    )}
  </FadeIn>
);

export default () => {
  const [count, setItems] = useState(6);

  return (
    <RetryContainer>
      <div css={{ textAlign: 'center', '> *': { marginRight: '4px' } }}>
        <Button onClick={() => setItems((list) => list - 1)}>Remove</Button>
        <Button onClick={() => setItems(6)}>Reset</Button>

        <ul
          css={{
            maxWidth: '474px',
            padding: 0,
            margin: '16px auto !important',
            div: { margin: '0' },
          }}
        >
          <StaggeredEntrance>
            <ExitingPersistence appear>
              {count > 0 && (
                <Card icon={<BitbucketIcon size="small" />} text="Bitbucket" />
              )}
              {count > 2 && (
                <Card
                  icon={<ConfluenceIcon size="small" />}
                  text="Confluence"
                />
              )}
              {count > 1 && (
                <Card
                  icon={<JiraServiceManagementIcon size="small" />}
                  text="Jira Service Management"
                />
              )}
              {count > 4 && (
                <Card
                  icon={<JiraSoftwareIcon size="small" />}
                  text="Jira Software"
                />
              )}
              {count > 5 && (
                <Card icon={<OpsgenieIcon size="small" />} text="Opsgenie" />
              )}
              {count > 3 && (
                <Card
                  icon={<StatuspageIcon size="small" />}
                  text="Statuspage"
                />
              )}
            </ExitingPersistence>
          </StaggeredEntrance>
        </ul>
      </div>
    </RetryContainer>
  );
};
