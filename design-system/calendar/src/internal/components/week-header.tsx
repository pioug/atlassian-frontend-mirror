/** @jsx jsx */
import { memo } from 'react';

import { css, jsx } from '@emotion/core';

import { N200 } from '@atlaskit/theme/colors';
import type { ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

const dayNameGridStyles = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  border: 0,
});

const dayNameCellStyles = css({
  boxSizing: 'border-box',
  minWidth: 40,
  padding: '8px 8px',
  border: 0,
  color: token('color.text.mediumEmphasis', N200),
  fontSize: 11,
  fontWeight: 700,
  textAlign: 'center',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
});

interface Props {
  daysShort: string[];
  mode?: ThemeModes;
}

const WeekHeader = memo<Props>(function WeekHeader({ daysShort }) {
  return (
    <div css={dayNameGridStyles}>
      {daysShort.map((shortDay) => (
        <span css={dayNameCellStyles} key={shortDay}>
          {shortDay}
        </span>
      ))}
    </div>
  );
});

WeekHeader.displayName = 'WeekHeader';

export default WeekHeader;
