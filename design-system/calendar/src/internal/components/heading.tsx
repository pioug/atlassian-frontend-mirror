/** @jsx jsx */
import { memo, useMemo } from 'react';

import { jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import ArrowleftIcon from '@atlaskit/icon/glyph/chevron-left-large';
import ArrowrightIcon from '@atlaskit/icon/glyph/chevron-right-large';
import { N70 } from '@atlaskit/theme/colors';
import { ThemeModes } from '@atlaskit/theme/types';

import {
  arrowLeftButtonStyle,
  arrowRightButtonStyle,
  monthAndYearStyle as getMonthAndYearStyle,
  headingStyle,
} from '../styles/heading';

interface Props {
  monthLongTitle: string;
  year: number;
  handleClickNext?: () => void;
  handleClickPrev?: () => void;
  mode: ThemeModes;
  testId?: string;
}

const Heading = memo(function Heading({
  monthLongTitle,
  year,
  handleClickPrev,
  handleClickNext,
  mode,
  testId,
}: Props) {
  const monthAndYearStyle = useMemo(() => getMonthAndYearStyle(mode), [mode]);
  return (
    <div css={headingStyle} aria-hidden="true">
      <Button
        css={arrowLeftButtonStyle}
        appearance="subtle"
        spacing="none"
        tabIndex={-1}
        onClick={handleClickPrev}
        testId={testId && `${testId}--previous-month`}
        iconBefore={
          <ArrowleftIcon label="Last month" size="medium" primaryColor={N70} />
        }
      />
      <div
        css={monthAndYearStyle}
        data-testid={testId && `${testId}--current-month-year`}
      >
        {`${monthLongTitle} ${year}`}
      </div>
      <Button
        css={arrowRightButtonStyle}
        appearance="subtle"
        spacing="none"
        tabIndex={-1}
        onClick={handleClickNext}
        testId={testId && `${testId}--next-month`}
        iconBefore={
          <ArrowrightIcon label="Next month" size="medium" primaryColor={N70} />
        }
      />
    </div>
  );
});

Heading.displayName = 'Heading';

export default Heading;
