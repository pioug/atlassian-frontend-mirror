import { Component } from 'react';

import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import { IntlProvider } from 'react-intl-next';

export function mountWithIntl<
  P = {},
  S = {},
  C extends Component<P, S> = Component<P, S>
>(jsx: JSX.Element): ReactWrapper<P, S, C> {
  return mount<C, P, S>(jsx, {
    wrappingComponent: IntlProvider,
    wrappingComponentProps: { locale: 'en' },
  } as any);
}

export function shallowWithIntl<
  P = {},
  S = {},
  C extends Component<P, S> = Component<P, S>
>(jsx: JSX.Element): ShallowWrapper<P, S, C> {
  return shallow<C, P, S>(jsx, {
    wrappingComponent: IntlProvider,
    wrappingComponentProps: { locale: 'en' },
  } as any);
}
