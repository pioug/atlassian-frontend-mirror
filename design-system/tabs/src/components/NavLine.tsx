/** @jsx jsx */
import { useMemo } from 'react';

import { jsx } from '@emotion/core';

import { ThemeModes } from '@atlaskit/theme/types';

import { getNavLineStyles } from '../internal/styles';

const NavLine = ({
  status,
  mode,
}: {
  status: 'normal' | 'selected';
  mode: ThemeModes;
}) => {
  return (
    <span
      css={useMemo(() => getNavLineStyles(mode), [mode])}
      data-selected={status === 'selected' ? true : undefined}
    />
  );
};

export default NavLine;
