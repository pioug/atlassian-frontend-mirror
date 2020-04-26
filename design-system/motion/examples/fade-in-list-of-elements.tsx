/** @jsx jsx */
import { jsx } from '@emotion/core';

import {
  BitbucketIcon,
  ConfluenceIcon,
  JiraServiceDeskIcon,
  JiraSoftwareIcon,
  OpsGenieIcon,
  StatuspageIcon,
} from '@atlaskit/logo';

import { Block, RetryContainer } from '../examples-utils';
import { FadeIn, StaggeredEntrance } from '../src';

const logos = [
  [<BitbucketIcon size="small" />, 'Bitbucket'],
  [<ConfluenceIcon size="small" />, 'Confluence'],
  [<JiraServiceDeskIcon size="small" />, 'Jira Service Desk'],
  [<JiraSoftwareIcon size="small" />, 'Jira Software'],
  [<OpsGenieIcon size="small" />, 'Ops Genie'],
  [<StatuspageIcon size="small" />, 'Statuspage'],
];

export default () => {
  return (
    <RetryContainer>
      <ul
        css={{
          maxWidth: '474px',
          padding: 0,
          margin: '16px auto !important',
          div: { margin: '0' },
        }}
      >
        {/* Hard code columns to 1 for extra perf. */}
        <StaggeredEntrance columns={1}>
          {logos.map((logo, index) => (
            <FadeIn key={index}>
              {props => (
                <li
                  {...props}
                  css={{ display: 'block', padding: 0, margin: '8px' }}
                >
                  <Block
                    css={{ width: '100%', height: '48px', borderRadius: '3px' }}
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
                        css={{ margin: 0, fontWeight: 300, marginLeft: '8px' }}
                      >
                        {logo[1]}
                      </h3>
                    </div>
                  </Block>
                </li>
              )}
            </FadeIn>
          ))}
        </StaggeredEntrance>
      </ul>
    </RetryContainer>
  );
};
