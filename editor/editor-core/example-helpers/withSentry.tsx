import React from 'react';
import * as Sentry from '@sentry/browser';

function withSentry<P extends {}>(
  Child:
    | React.ComponentClass<any, any>
    | ((props: any) => React.ReactElement<any>),
) {
  return class WrappedComponent extends React.Component<P> {
    componentDidMount() {
      /** Add Sentry for non-local envs */
      if (!window.location.href.match(/localhost/)) {
        Sentry.init({
          dsn:
            'https://f3b4e0f5f28c465d9a45a4129251482f@sentry.prod.atl-paas.net/1044',
        });
      }
    }

    render() {
      return <Child {...this.props} />;
    }
  };
}

export default withSentry;
