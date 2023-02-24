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
import { FadeIn, StaggeredEntrance, useResizingHeight } from '@atlaskit/motion';
import { N20, N50A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { Centered } from '../../examples-utils';

const MotionResizeHeightExample = () => {
  const [num, setNum] = useState(1);

  return (
    <div>
      <div css={containerStyles}>
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
        <div data-testid="menu" {...useResizingHeight()} css={containerStyles}>
          <FocusRing isInset>
            <input
              type="text"
              readOnly
              value={searchTerm[`s${num}`]}
              css={centeredContainerStyles}
            />
          </FocusRing>
          <StaggeredEntrance columns={1}>
            {Array(num)
              .fill(undefined)
              .map((_, index) => (
                <FadeIn key={index}>
                  {(motion) => (
                    <div css={logoContainerStyles} {...motion}>
                      {logos[index][0]}
                      <h3 css={headerStyles}>{logos[index][1]}</h3>
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

const containerStyles = css({
  textAlign: 'center',
  '> *': {
    marginRight: token('space.025', '2px'),
  },
});

const centeredContainerStyles = css({
  width: '100%',
  maxWidth: '500px',
  marginTop: token('space.300', '24px'),
  marginBottom: token('space.800', '56px'),
  paddingBottom: token('space.100', '8px'),
  borderRadius: token('border.radius.100', '3px'),
  boxShadow: token(
    'elevation.shadow.overlay',
    `0 20px 32px -8px ${N50A}, 0 0 1px ${N60A}`,
  ),
});

const logoContainerStyles = css({
  display: 'flex',
  padding: token('space.200', '16px'),
  fontSize: token('font.size.200', '16px'),
  fontWeight: token('font.weight.medium', '500'),
  ':hover': {
    backgroundColor: token('color.background.accent.gray.subtler', N20),
  },
});

const headerStyles = css({
  margin: token('space.0', '0px'),
  marginLeft: token('space.100', '8px'),
  fontWeight: 300,
});

export default MotionResizeHeightExample;
