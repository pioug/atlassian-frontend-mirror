/** @jsx jsx */
import { memo } from 'react';

import { jsx } from '@emotion/react';

import Text from '@atlaskit/ds-explorations/text';
import { Box, xcss } from '@atlaskit/primitives';
import type { ThemeModes } from '@atlaskit/theme/types';

import WeekDayGrid from './week-day-grid';

interface WeekHeaderProps {
  daysShort: string[];
  mode?: ThemeModes;
  testId?: string;
}

const columnHeaderStyles = xcss({
  minWidth: 'size.400', // Account for languages with short week day names
  whiteSpace: 'nowrap', // Account for languages with long week day names
  textAlign: 'center',
  lineHeight: '16px',
  color: 'subtle', // Apply correct fallback to shortDay text
});

const WeekHeader = memo<WeekHeaderProps>(function WeekHeader({
  daysShort,
  testId,
}) {
  return (
    <WeekDayGrid testId={testId && `${testId}--column-headers`}>
      {daysShort.map((shortDay) => (
        <Box
          padding="space.100"
          xcss={columnHeaderStyles}
          key={shortDay}
          role="columnheader"
        >
          <Text
            fontWeight="bold"
            fontSize="size.050"
            verticalAlign="middle"
            textTransform="uppercase"
          >
            {shortDay}
          </Text>
        </Box>
      ))}
    </WeekDayGrid>
  );
});

WeekHeader.displayName = 'WeekHeader';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default WeekHeader;
