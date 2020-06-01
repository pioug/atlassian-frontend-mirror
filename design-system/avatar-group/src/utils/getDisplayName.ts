import { ComponentType } from 'react';

export function getDisplayName(prefix: string, Component: ComponentType<any>) {
  const componentName: string = Component.displayName || Component.name;

  return componentName ? `${prefix}(${componentName})` : prefix;
}
