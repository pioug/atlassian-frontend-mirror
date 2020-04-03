import { ComponentType } from 'react';

// from https://facebook.github.io/react/docs/higher-order-components.html

const getDisplayName = (WrappedComponent: ComponentType) =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component';

export default getDisplayName;
