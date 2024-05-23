/** @jsx jsx */
import { type FC } from 'react';

import { css, jsx } from '@emotion/react';

import type { VisuallyHiddenProps } from './types';

// eslint-disable-next-line @atlaskit/design-system/use-visually-hidden
const visuallyHiddenStyles = css({
  width: '1px',
  height: '1px',
  padding: '0',
  position: 'absolute',
  border: '0',
  clip: 'rect(1px, 1px, 1px, 1px)',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
});

/**
 * __Visually hidden__
 *
 * A composable element to apply a visually hidden effect to children.
 * Useful for accessibility compliance.
 *
 * @example
 * ```jsx
 * import VisuallyHidden from '@atlaskit/visually-hidden';
 *
 * export default () => (
 *   <div style={{ border: '1px solid black' }}>
 *      There is text hidden between the brackets [
 *      <VisuallyHidden>Can't see me!</VisuallyHidden>]
 *   </div>
 * );
 * ```
 */
const VisuallyHidden: FC<VisuallyHiddenProps> = ({
  children,
  testId,
  role,
  id,
}) => {
  return (
    <span id={id} data-testid={testId} css={visuallyHiddenStyles} role={role}>
      {children}
    </span>
  );
};

export default VisuallyHidden;
