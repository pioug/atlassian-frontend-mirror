/** @jsx jsx */

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/custom-theme-button';
import { ProgressIndicator } from '@atlaskit/progress-indicator';
import { gridSize as getGridSize } from '@atlaskit/theme/constants';

import { SpotlightCard } from '../src';

const gridSize = getGridSize();

const wrapperStyles = css({
  display: 'flex',
  height: '100%',
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
  paddingBottom: `${gridSize * 2}px`,
});

const optionStyles = css({
  padding: `${gridSize / 2}px`,
});

const Option: React.FC<{}> = ({ children }) => (
  <div css={optionStyles}>{children}</div>
);

const NewUser: React.FC<{}> = () => (
  <div css={wrapperStyles}>
    <div>
      <div css={headingStyles}>
        <h2>Welcome to Jira</h2>
        <ProgressIndicator values={[1, 2, 3]} selectedIndex={0} />
      </div>
      <p css={taglineStyles}>
        Tell us about your team so we can personalise your project for you
      </p>
      <SpotlightCard heading="Why are you trying Jira Software?" isFlat>
        <Option>
          <Button>Learn about Agile</Button>
        </Option>
        <Option>
          <Button>Explore the product</Button>
        </Option>
        <Option>
          <Button>Setting it up for my team</Button>
        </Option>
      </SpotlightCard>
    </div>
  </div>
);

export default NewUser;
