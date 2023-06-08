/** @jsx jsx */
import { memo } from 'react';

import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import Heading from '@atlaskit/heading';
import ArrowleftIcon from '@atlaskit/icon/glyph/chevron-left-large';
import ArrowrightIcon from '@atlaskit/icon/glyph/chevron-right-large';
import { Box, Inline } from '@atlaskit/primitives';
import { N700 } from '@atlaskit/theme/colors';
import { ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

interface HeaderProps {
  monthLongTitle: string;
  year: number;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
  handleClickNext?: () => void;
  handleClickPrev?: () => void;
  mode?: ThemeModes;
  testId?: string;
}

const Header = memo<HeaderProps>(function Header({
  monthLongTitle,
  year,
  previousMonthLabel = 'Last month',
  nextMonthLabel = 'Next month',
  handleClickPrev,
  handleClickNext,
  testId,
}) {
  return (
    <Box paddingInline="space.100" aria-hidden="true">
      <Inline space="space.0" alignBlock="center" spread="space-between">
        <Button
          appearance="subtle"
          spacing="none"
          tabIndex={-1}
          onClick={handleClickPrev}
          testId={testId && `${testId}--previous-month`}
          iconBefore={
            <ArrowleftIcon
              label={previousMonthLabel}
              size="medium"
              primaryColor={token('color.icon', N700)}
              testId={testId && `${testId}--previous-month-icon`}
            />
          }
        />
        <Heading
          level="h400"
          as="div"
          testId={testId && `${testId}--current-month-year`}
        >
          {`${monthLongTitle} ${year}`}
        </Heading>
        <Button
          appearance="subtle"
          spacing="none"
          tabIndex={-1}
          onClick={handleClickNext}
          testId={testId && `${testId}--next-month`}
          iconBefore={
            <ArrowrightIcon
              label={nextMonthLabel}
              size="medium"
              primaryColor={token('color.icon', N700)}
              testId={testId && `${testId}--next-month-icon`}
            />
          }
        />
      </Inline>
    </Box>
  );
});

Header.displayName = 'Header';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Header;
