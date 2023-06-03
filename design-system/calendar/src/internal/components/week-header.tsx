/** @jsx jsx */
import { memo } from 'react';

import { jsx } from '@emotion/react';

import Box from '@atlaskit/ds-explorations/box';
import Text from '@atlaskit/ds-explorations/text';
import { N200 } from '@atlaskit/theme/colors';
import type { ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

import WeekDayGrid from './week-day-grid';

interface WeekHeaderProps {
  daysShort: string[];
  mode?: ThemeModes;
  testId?: string;
}

const WeekHeader = memo<WeekHeaderProps>(function WeekHeader({
  daysShort,
  testId,
}) {
  return (
    <WeekDayGrid testId={testId && `${testId}--column-headers`}>
      {daysShort.map((shortDay) => (
        <Box
          padding="space.100"
          display="block"
          UNSAFE_style={{
            minWidth: 40, // Account for languages with short week day names
            whiteSpace: 'nowrap', // Account for languages with long week day names
            textAlign: 'center',
            lineHeight: '16px',
            color: token('color.text.subtle', N200), // Apply correct fallback to shortDay text
          }}
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
