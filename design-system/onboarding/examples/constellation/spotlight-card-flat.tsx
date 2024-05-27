/** @jsx jsx */
import { type ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/custom-theme-button';
import { Box, xcss } from '@atlaskit/primitives';
import { ProgressIndicator } from '@atlaskit/progress-indicator';
import { token } from '@atlaskit/tokens';

import { SpotlightCard } from '../../src';

const wrapperStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
});

const headingStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const taglineStyles = css({
  paddingBlockEnd: token('space.200', '16px'),
});

const optionStyles = xcss({
  padding: 'space.050',
});

const Option = ({ children }: { children: ReactNode }) => (
  <Box xcss={optionStyles}>{children}</Box>
);

const SpotlightCardIsFlat = () => {
  return (
    <div css={wrapperStyles}>
      <div>
        <div css={headingStyles}>
          <h2>Welcome to Jira</h2>
          <ProgressIndicator values={[1, 2, 3]} selectedIndex={0} />
        </div>
        <p css={taglineStyles}>
          Tell us about your team so we can personalise your project for you.
        </p>
        <SpotlightCard heading="Why are you trying Jira Software?" isFlat>
          <Option>
            <Button>Learn about agile</Button>
          </Option>
          <Option>
            <Button>Explore the product</Button>
          </Option>
          <Option>
            <Button>How to set up Jira for your team</Button>
          </Option>
        </SpotlightCard>
      </div>
    </div>
  );
};

export default SpotlightCardIsFlat;
