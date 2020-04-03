import { Component } from 'react';
import { AppProxyReactContext } from './app';
import { Store } from 'redux';
import { State } from '../domain';
import { UIAnalyticsEventHandler } from '@atlaskit/analytics-next';
import { intlShape, IntlProvider } from 'react-intl';

export interface PassContextProps {
  store: Store<State>;
  proxyReactContext?: AppProxyReactContext;
}
export default class PassContext extends Component<PassContextProps, any> {
  // We need to manually specify all the child contexts
  static childContextTypes = {
    store() {},
    getAtlaskitAnalyticsEventHandlers() {},
    intl: intlShape,
  };

  private createDefaultI18nProvider = () =>
    new IntlProvider({ locale: 'en' }).getChildContext().intl;

  getChildContext() {
    const { store, proxyReactContext } = this.props;
    const getAtlaskitAnalyticsEventHandlers: UIAnalyticsEventHandler =
      proxyReactContext && proxyReactContext.getAtlaskitAnalyticsEventHandlers
        ? proxyReactContext.getAtlaskitAnalyticsEventHandlers
        : () => [];
    const intl =
      (proxyReactContext && proxyReactContext.intl) ||
      this.createDefaultI18nProvider();

    return {
      store,
      getAtlaskitAnalyticsEventHandlers,
      intl,
    };
  }

  render() {
    const { children } = this.props;

    return children;
  }
}
