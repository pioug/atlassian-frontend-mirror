/**
 * Copied to avoid circular dependencies from atlassian-frontend/packages/editor/editor-test-helpers/src/enzyme.tsx
 *
 * Components using the react-intl module require access to the intl context.
 * This is not available when mounting single components in Enzyme.
 * These helper functions aim to address that and wrap a valid,
 * English-locale intl context around them.
 */

import { mount, ReactWrapper } from 'enzyme';
import type { Component } from 'react';

import { IntlProvider } from 'react-intl-next';

export function mountWithIntl<
  P = {},
  S = {},
  C extends Component<P, S> = Component<P, S>,
>(jsx: JSX.Element): ReactWrapper<P, S, C> {
  return mount<C, P, S>(jsx, {
    wrappingComponent: IntlProvider,
    wrappingComponentProps: { locale: 'en' },
  } as any);
}
