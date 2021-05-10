/** @jsx jsx */
import { forwardRef, memo, useMemo } from 'react';

import { jsx } from '@emotion/core';

import { useGlobalTheme } from '@atlaskit/theme/components';

import { getCodeStyles } from './internal/theme/styles';
import type { CodeProps } from './types';

const Code = memo(
  forwardRef<HTMLElement, CodeProps>(function Code({ testId, ...props }, ref) {
    const theme = useGlobalTheme();
    const styles = useMemo(() => getCodeStyles(theme), [theme]);

    return <code ref={ref} data-testid={testId} css={styles} {...props} />;
  }),
);

Code.displayName = 'Code';

export { getCodeStyles };

export default Code;
