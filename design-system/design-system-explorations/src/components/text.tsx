/** @jsx jsx */
import { jsx } from '@emotion/core';

interface TextProps {
  children: string | number;
}

/**
 * __Text__
 *
 * A text {description}.
 *
 * @internal
 */
function Text({ children }: TextProps) {
  return <span>{children}</span>;
}

export default Text;
