/** @jsx jsx */

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/custom-theme-button';
import UndoIcon from '@atlaskit/icon/glyph/editor/undo';
import { h400 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { SpotlightCard } from '../src';

import welcomeImage from './assets/this-is-new-jira.png';

const wrapperStyles = css({
  display: 'flex',
  width: '600px',
  height: '500px',
  padding: token('space.200', '16px'),
  alignItems: 'space-evenly',
  justifyContent: 'space-evenly',
  flexDirection: 'column',
  flexWrap: 'wrap',
});

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
const semiboldStyles = css([
  css(h400({ theme: { mode: 'light' } })),
  {
    color: 'inherit',
  },
]);

const copy =
  'Quickly switch between your most recent projects by selecting the project name and icon.';

export default () => {
  return (
    <div css={wrapperStyles} data-testid="spotlight-examples">
      <SpotlightCard
        actions={[{ text: 'Next', onClick: () => {} }]}
        actionsBeforeElement="1/3"
        width={275}
      >
        {copy}
      </SpotlightCard>
      <SpotlightCard
        actions={[
          { text: 'Next', onClick: () => {} },
          { text: 'Skip', onClick: () => {}, appearance: 'subtle' },
        ]}
        width={275}
      >
        {copy}
      </SpotlightCard>
      <SpotlightCard
        actionsBeforeElement={
          <p css={semiboldStyles}>Try clicking the project name.</p>
        }
        width={275}
      >
        {copy}
      </SpotlightCard>
      <SpotlightCard
        image={<img alt="" src={welcomeImage} width="275" />}
        actions={[{ text: 'Next', onClick: () => {} }]}
        width={275}
      >
        {copy}
      </SpotlightCard>
      <SpotlightCard
        heading="Switch it up"
        headingAfterElement={
          <Button iconBefore={<UndoIcon label="" />} appearance="subtle">
            Replay
          </Button>
        }
        actions={[{ text: 'Got it', onClick: () => {} }]}
        width={275}
      >
        {copy}
      </SpotlightCard>
    </div>
  );
};
