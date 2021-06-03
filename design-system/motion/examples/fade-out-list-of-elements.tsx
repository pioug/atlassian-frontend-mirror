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

const logos = [
  [<BitbucketIcon size="small" />, 'Bitbucket'],
  [<ConfluenceIcon size="small" />, 'Confluence'],
  [<JiraServiceManagementIcon size="small" />, 'Jira Service Management'],
  [<JiraSoftwareIcon size="small" />, 'Jira Software'],
  [<OpsgenieIcon size="small" />, 'Opsgenie'],
  [<StatuspageIcon size="small" />, 'Statuspage'],
];

const randRemove = <T extends Array<TItem>, TItem>(arr: T) => {
  const newArr = arr.concat([]);
  newArr.splice(Date.now() % newArr.length, 1);
  return newArr;
};

export default () => {
  const [items, setItems] = useState(logos);

  return (
    <RetryContainer>
      <div css={{ textAlign: 'center', '> *': { marginRight: '4px' } }}>
        <Button onClick={() => setItems((list) => randRemove(list))}>
          Random remove
        </Button>
        <Button onClick={() => setItems(logos)}>Reset</Button>

        <ul
          css={{
            maxWidth: '474px',
            height: '328px',
            padding: 0,
            margin: '16px auto !important',
            div: { margin: '0' },
          }}
        >
          <StaggeredEntrance>
            <ExitingPersistence appear>
              {items.map((logo) => (
                // Gotcha #1 set propery keys YO
                <FadeIn key={logo[1] as string}>
                  {(props) => (
                    <li
                      {...props}
                      css={{ display: 'block', padding: 0, margin: '8px' }}
                    >
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
                          {logo[0]}
                          <h3
                            css={{
                              margin: 0,
                              fontWeight: 300,
                              marginLeft: '8px',
                            }}
                          >
                            {logo[1]}
                          </h3>
                        </div>
                      </Block>
                    </li>
                  )}
                </FadeIn>
              ))}
            </ExitingPersistence>
          </StaggeredEntrance>
        </ul>
      </div>
    </RetryContainer>
  );
};
