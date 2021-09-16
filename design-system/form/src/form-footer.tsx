/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { gridSize as getGridSize } from '@atlaskit/theme/constants';

import { Align } from './types';
interface FormFooterProps {
  /**
   * Children to be rendered in the footer.
   */
  children?: ReactNode;
  /**
   * Footer contents should be left-aligned in single-page forms, flags, cards and section messages with the primary button on the left.
   */
  align?: Align;
}

const gridSize = getGridSize();

const formFooterWrapperStyles = css({
  display: 'flex',
  marginTop: `${gridSize * 3}px`,
  justifyContent: 'flex-end',
});

const justifyContentStyles = css({
  justifyContent: 'flex-start',
});

/**
 * __Form footer__
 *
 * A form footer has the content to be shown at the bottom of the form. This is usually the submit button.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/form/docs/layout)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/form/docs/layout)
 * - [Usage](https://atlaskit.atlassian.com/packages/design-system/form/docs/layout)
 */
export default function FormFooter({
  align = 'end',
  children,
}: FormFooterProps) {
  return (
    <footer
      css={[formFooterWrapperStyles, align === 'start' && justifyContentStyles]}
    >
      {children}
    </footer>
  );
}
