/** @jsx jsx */
import { memo, useCallback, useState } from 'react';

import { jsx } from '@emotion/core';

import GlobalTheme from '@atlaskit/theme/components';
import { GlobalThemeTokens } from '@atlaskit/theme/types';

import { BreadcrumbsProps } from '../types';

import BreadcrumbsStateless from './BreadcrumbsStateless';

const Breadcrumbs = memo((props: BreadcrumbsProps) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpansion = useCallback(() => {
    setExpanded(true);
  }, []);

  return (
    <GlobalTheme.Consumer>
      {(tokens: GlobalThemeTokens) => {
        const mode = tokens.mode;
        return (
          <BreadcrumbsStateless
            {...props}
            mode={mode}
            isExpanded={expanded}
            onExpand={handleExpansion}
          />
        );
      }}
    </GlobalTheme.Consumer>
  );
});
export default Breadcrumbs;
