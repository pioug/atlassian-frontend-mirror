/** @jsx jsx */
import { useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import FocusRing from '@atlaskit/focus-ring';
import {
  BitbucketIcon,
  ConfluenceIcon,
  JiraSoftwareIcon,
  OpsgenieIcon,
  StatuspageIcon,
} from '@atlaskit/logo';
import { N10, N20, N50A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { Centered } from '../examples-utils';
import { FadeIn, StaggeredEntrance, useResizingHeight } from '../src';

const logos = [
  [<BitbucketIcon size="small" />, 'Bitbucket'],
  [<ConfluenceIcon size="small" />, 'Confluence'],
  [<JiraSoftwareIcon size="small" />, 'Jira Software'],
  [<OpsgenieIcon size="small" />, 'Opsgenie'],
  [<StatuspageIcon size="small" />, 'Statuspage'],
];

const searchTerm: { [key: string]: string } = {
  s1: 'dev',
  s2: 'design',
  s3: 'software',
  s4: 'ops',
  s5: 'all',
};

export default () => {
  const [num, setNum] = useState(1);

  return (
    <div>
      <div
        css={{
          textAlign: 'center',
          '> *': { margin: token('space.025', '2px') },
        }}
      >
        {[1, 2, 3, 4, 5].map((number) => (
          <Button
            testId={`button--${number}`}
            key={number}
            isSelected={num === number}
            onClick={() => {
              setNum(number);
            }}
          >
            {number}
          </Button>
        ))}
      </div>

      <Centered>
        <div
          data-testid="menu"
          {...useResizingHeight()}
          css={css({
            width: '100%',
            maxWidth: '500px',
            marginTop: token('space.300', '24px'),
            // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
            marginBottom: '56px',
            paddingBottom: token('space.100', '8px'),
            borderRadius: token('border.radius.100', '3px'),
            boxShadow: token(
              'elevation.shadow.overlay',
              `0 20px 32px -8px ${N50A}, 0 0 1px ${N60A}`,
            ),
          })}
        >
          <FocusRing isInset>
            <input
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              type="text"
              readOnly
              value={searchTerm[`s${num}`]}
              css={css({
                display: 'block',
                boxSizing: 'border-box',
                width: '100%',
                marginBottom: token('space.100', '8px'),
                padding: token('space.200', '16px'),
                border: 'none',
                borderRadius: `${token('border.radius', '3px')} ${token(
                  'border.radius',
                  '3px',
                )} 0 0`,
                color: '#172b4d',
                fontSize: token('font.size.400', '24px'),
                ':hover': {
                  backgroundColor: N10,
                },
              })}
            />
          </FocusRing>
          <StaggeredEntrance columns={1}>
            {Array(num)
              .fill(undefined)
              .map((_, index) => (
                <FadeIn key={index}>
                  {(motion) => (
                    <div
                      css={css({
                        display: 'flex',
                        padding: token('space.200', '16px'),
                        fontSize: token('font.size.200', '16px'),
                        fontWeight: token('font.weight.medium', '500'),
                        ':hover': {
                          backgroundColor: N20,
                        },
                      })}
                      {...motion}
                    >
                      {logos[index][0]}
                      <h3
                        css={{
                          margin: 0,
                          fontWeight: 300,
                          marginLeft: token('space.100', '8px'),
                        }}
                      >
                        {logos[index][1]}
                      </h3>
                    </div>
                  )}
                </FadeIn>
              ))}
          </StaggeredEntrance>
        </div>
      </Centered>
    </div>
  );
};
