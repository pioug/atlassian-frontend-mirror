/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required */
/* eslint-disable @repo/internal/react/boolean-prop-naming-convention */
/* eslint-disable @repo/internal/react/consistent-props-definitions */

import { HeaderProps } from '../../src/components/Header';

interface FooterProps extends HeaderProps {
  /**
   * @deprecated
   * Enables use of deprecated `cssFn`, `onClick` and `component` props.
   * If this prop is not set to true, you will see a deprecation warning.
   */
  useDeprecatedApi?: boolean;
}

export default (props: FooterProps) => null;
