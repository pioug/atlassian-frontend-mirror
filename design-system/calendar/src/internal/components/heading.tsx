/** @jsx jsx */
import { memo } from 'react';

import { jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import ArrowleftIcon from '@atlaskit/icon/glyph/chevron-left-large';
import ArrowrightIcon from '@atlaskit/icon/glyph/chevron-right-large';
import { N70 } from '@atlaskit/theme/colors';

import {
  arrowLeftStyle,
  arrowRightStyle,
  headingStyle,
  monthAndYearStyle,
} from '../styles/heading';

interface Props {
  monthLongTitle: string;
  year: number;
  handleClickNext?: () => void;
  handleClickPrev?: () => void;
  testId?: string;
}

const Heading = memo(function Heading({
  monthLongTitle,
  year,
  handleClickPrev,
  handleClickNext,
  testId,
}: Props) {
  return (
    <div css={headingStyle} aria-hidden="true">
      <div css={arrowLeftStyle}>
        <Button
          appearance="subtle"
          spacing="none"
          tabIndex={-1}
          onClick={handleClickPrev}
          testId={testId && `${testId}--previous-month`}
          iconBefore={
            <ArrowleftIcon
              label="Last month"
              size="medium"
              primaryColor={N70}
            />
          }
        />
      </div>
      <div
        css={monthAndYearStyle}
        data-testid={testId && `${testId}--current-month-year`}
      >
        {`${monthLongTitle} ${year}`}
      </div>
      <div css={arrowRightStyle}>
        <Button
          appearance="subtle"
          spacing="none"
          tabIndex={-1}
          onClick={handleClickNext}
          testId={testId && `${testId}--next-month`}
          iconBefore={
            <ArrowrightIcon
              label="Next month"
              size="medium"
              primaryColor={N70}
            />
          }
        />
      </div>
    </div>
  );
});

Heading.displayName = 'Heading';

export default Heading;
