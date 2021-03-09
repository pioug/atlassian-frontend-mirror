/** @jsx jsx */
import { memo, useMemo } from 'react';

import { jsx } from '@emotion/core';

import type { ThemeModes } from '@atlaskit/theme/types';

import { thStyle as getThStyle, theadStyle } from '../styles/table';

interface Props {
  daysShort: string[];
  mode: ThemeModes;
}

const WeekHeader = memo(function WeekHeader({ daysShort, mode }: Props) {
  const thStyle = useMemo(() => getThStyle(mode), [mode]);

  return (
    <thead css={theadStyle}>
      <tr>
        {daysShort.map(shortDay => (
          <th css={thStyle} key={shortDay}>
            {shortDay}
          </th>
        ))}
      </tr>
    </thead>
  );
});

WeekHeader.displayName = 'WeekHeader';

export default WeekHeader;
