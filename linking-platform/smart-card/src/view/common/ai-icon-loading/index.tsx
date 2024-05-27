/** @jsx jsx */
import { css, jsx, keyframes } from '@emotion/react';

import { type FunctionComponent } from 'react';

import SVG from '@atlaskit/icon/svg';
import { type SVGProps } from '@atlaskit/icon/types';
import { aiThemeTokens } from '../ai-prism/constants';

/**
 * The bulk of this file is originally from
 * https://bitbucket.org/atlassian/barrel/src/master/ui/platform/ui-kit/ai
 * with modifications
 */

const bounce = keyframes({
  from: {
    transform: 'translateY(0)',
  },
  '16.67%': {
    transform: 'translateY(-2px)',
  },
  '33.33%': {
    transform: 'translateY(0px)',
  },
});

const BASE_DELAY = 400;
const QUEUE_DELAY = 200;

const animationStyles = css({
  animation: `${bounce} 1.2s linear infinite normal`,
});
const firstDelayStyles = css({
  animationDelay: `${BASE_DELAY + QUEUE_DELAY}ms`,
});
const secondDelayStyles = css({
  animationDelay: `${BASE_DELAY + QUEUE_DELAY * 2}ms`,
});
const thirdDelayStyles = css({
  animationDelay: `${BASE_DELAY + QUEUE_DELAY * 3}ms`,
});

/**
 * this icon is theme agnostic, no need for tokens
 */
const AIIconLoading: FunctionComponent<SVGProps> = (props) => (
  <SVG {...props}>
    <circle
      css={[animationStyles, firstDelayStyles]}
      cx="6"
      cy="12"
      r="1.5"
      fill={aiThemeTokens.blue700}
    />
    <circle
      css={[animationStyles, secondDelayStyles]}
      cx="12"
      cy="12"
      r="1.5"
      fill={aiThemeTokens.blue600}
    />
    <circle
      css={[animationStyles, thirdDelayStyles]}
      cx="17.5"
      cy="12"
      r="1.5"
      fill={aiThemeTokens.blue500}
    />
  </SVG>
);

export default AIIconLoading;
