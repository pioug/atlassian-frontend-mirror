/** @jsx jsx */

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/custom-theme-button';
import UndoIcon from '@atlaskit/icon/glyph/editor/undo';
import { useGlobalTheme } from '@atlaskit/theme/components';
import { h400 } from '@atlaskit/theme/typography';

import { SpotlightCard } from '../src';

import welcomeImage from './assets/this-is-new-jira.png';

// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const lightH400Styles = css(h400({ theme: { mode: 'light' } }));
// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const darkH400Styles = css(h400({ theme: { mode: 'dark' } }));

const wrapperStyles = css({
  display: 'flex',
  width: '600px',
  height: '500px',
  padding: '16px',
  alignItems: 'space-evenly',
  justifyContent: 'space-evenly',
  flexDirection: 'column',
  flexWrap: 'wrap',
});

const semiboldStyles = css({
  color: 'inherit',
});

const copy =
  'Quickly switch between your most recent projects by selecting the project name and icon.';

export default () => {
  const { mode } = useGlobalTheme();
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
          <p
            css={[
              mode === 'light' ? lightH400Styles : darkH400Styles,
              semiboldStyles,
            ]}
          >
            Try clicking the project name.
          </p>
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
          <Button iconBefore={<UndoIcon label="undo" />} appearance="subtle">
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
