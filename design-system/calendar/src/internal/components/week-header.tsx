/** @jsx jsx */
import { memo, useMemo } from 'react';

import { jsx } from '@emotion/core';

import type { ThemeModes } from '@atlaskit/theme/types';

import {
  dayNameGridStyle,
  dayNameCellStyle as getDayNameCellStyle,
} from '../styles/grid';

interface Props {
  daysShort: string[];
  mode: ThemeModes;
}

const WeekHeader = memo(function WeekHeader({ daysShort, mode }: Props) {
  const dayNameCellStyle = useMemo(() => getDayNameCellStyle(mode), [mode]);

  return (
    <div css={dayNameGridStyle}>
      {daysShort.map(shortDay => (
        <span css={dayNameCellStyle} key={shortDay}>
          {shortDay}
        </span>
      ))}
    </div>
  );
});

WeekHeader.displayName = 'WeekHeader';

export default WeekHeader;
