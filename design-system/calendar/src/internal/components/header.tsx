/** @jsx jsx */
import { memo } from 'react';

import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import Heading from '@atlaskit/heading';
import ArrowleftIcon from '@atlaskit/icon/glyph/chevron-left-large';
import ArrowrightIcon from '@atlaskit/icon/glyph/chevron-right-large';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { Box, Inline } from '@atlaskit/primitives';
import { N700 } from '@atlaskit/theme/colors';
import { ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

import useUniqueId from '../../internal/hooks/use-unique-id';
import { TabIndex } from '../../types';

interface HeaderProps {
  monthLongTitle: string;
  year: number;
  previousMonthLabel?: string;
  previousHeading: string;
  nextMonthLabel?: string;
  nextHeading: string;
  handleClickNext?: () => void;
  handleClickPrev?: () => void;
  mode?: ThemeModes;
  headerId: string;
  tabIndex?: TabIndex;
  testId?: string;
}

const Header = memo<HeaderProps>(function Header({
  monthLongTitle,
  year,
  previousMonthLabel = getBooleanFF(
    'platform.design-system-team.calendar-keyboard-accessibility_967h1',
  )
    ? 'Previous month'
    : 'Last month',
  previousHeading,
  nextMonthLabel = 'Next month',
  nextHeading,
  handleClickPrev,
  handleClickNext,
  headerId,
  tabIndex,
  testId,
}) {
  const announceId = useUniqueId('month-year-announce');

  const renderedHeading = (
    <Heading
      level="h400"
      as={
        getBooleanFF(
          'platform.design-system-team.calendar-keyboard-accessibility_967h1',
        )
          ? 'h2'
          : 'div'
      }
      id={
        getBooleanFF(
          'platform.design-system-team.calendar-keyboard-accessibility_967h1',
        )
          ? headerId
          : undefined
      }
      testId={testId && `${testId}--current-month-year`}
    >
      {`${monthLongTitle} ${year}`}
    </Heading>
  );

  return (
    <Box
      paddingInline="space.100"
      aria-hidden={
        getBooleanFF(
          'platform.design-system-team.calendar-keyboard-accessibility_967h1',
        )
          ? undefined
          : 'true'
      }
    >
      <Inline space="space.0" alignBlock="center" spread="space-between">
        <Button
          appearance="subtle"
          spacing="none"
          tabIndex={
            getBooleanFF(
              'platform.design-system-team.calendar-keyboard-accessibility_967h1',
            )
              ? tabIndex
              : -1
          }
          onClick={handleClickPrev}
          testId={testId && `${testId}--previous-month`}
          iconBefore={
            <ArrowleftIcon
              label={
                getBooleanFF(
                  'platform.design-system-team.calendar-keyboard-accessibility_967h1',
                )
                  ? `${previousMonthLabel}, ${previousHeading}`
                  : previousMonthLabel
              }
              size="medium"
              primaryColor={token('color.icon', N700)}
              testId={testId && `${testId}--previous-month-icon`}
            />
          }
        />
        {getBooleanFF(
          'platform.design-system-team.calendar-keyboard-accessibility_967h1',
        ) ? (
          // This is required to ensure that the new month/year is announced when the previous/next month buttons are activated
          <Box
            aria-live="polite"
            id={announceId}
            testId={testId && `${testId}--current-month-year--container`}
          >
            {renderedHeading}
          </Box>
        ) : (
          renderedHeading
        )}
        <Button
          appearance="subtle"
          spacing="none"
          tabIndex={
            getBooleanFF(
              'platform.design-system-team.calendar-keyboard-accessibility_967h1',
            )
              ? tabIndex
              : -1
          }
          onClick={handleClickNext}
          testId={testId && `${testId}--next-month`}
          iconBefore={
            <ArrowrightIcon
              label={
                getBooleanFF(
                  'platform.design-system-team.calendar-keyboard-accessibility_967h1',
                )
                  ? `${nextMonthLabel}, ${nextHeading}`
                  : nextMonthLabel
              }
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
