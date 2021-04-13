/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/custom-theme-button';
import { N200 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import Tooltip from '@atlaskit/tooltip';

interface Props {
  onChange: (value: number) => void;
  value: number | undefined;
}

const tooltipMessage = [
  'Strongly disagree',
  'Disagree',
  'Slightly disagree',
  'Neutral',
  'Slightly agree',
  'Agree',
  'Strongly agree',
];

export default ({ onChange, value }: Props) => (
  <div>
    <div
      css={css`
        display: flex;
        justify-content: space-between;

        & > * + * {
          margin-left: ${gridSize()}px;
        }

        & > * {
          flex: 1;

          & > button {
            justify-content: center;
          }
        }
      `}
    >
      {Array.from({ length: 7 }, (_, i) => {
        const score = i + 1;
        const isSelected: boolean = value === score;

        return (
          <Tooltip content={tooltipMessage[i]} key={score} hideTooltipOnClick>
            <Button
              onClick={() => onChange(score)}
              isSelected={isSelected}
              aria-pressed={isSelected}
              aria-describedby="contextualSurveyStatement"
              aria-label={tooltipMessage[i]}
              shouldFitContainer
            >
              {score}
            </Button>
          </Tooltip>
        );
      })}
    </div>
    <div
      css={css`
        font-size: 12px;
        font-weight: 600;
        color: ${N200};
        display: flex;
        margin-top: ${gridSize()}px;
        margin-bottom: ${gridSize() * 3}px;

        & > span {
          width: ${gridSize() * 10}px;
        }
      `}
      aria-hidden
    >
      <span>Strongly disagree</span>
      <span
        css={css`
          text-align: center;
          margin: 0 auto;
          padding: 0 ${gridSize() * 6}px;
        `}
      >
        Neutral
      </span>
      <span
        css={css`
          text-align: right;
        `}
      >
        Strongly agree
      </span>
    </div>
  </div>
);
