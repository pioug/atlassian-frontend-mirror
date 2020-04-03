import { ComponentType } from 'react';

export function omit<T extends Record<any, any>, K extends string[]>(
  obj: T,
  ...keysToOmit: K
) {
  const newObj = { ...obj } as T;

  for (const key of keysToOmit) {
    delete newObj[key];
  }

  return newObj as Omit<T, keyof K>;
}

export function getDisplayName(prefix: string, Component: ComponentType<any>) {
  const componentName: string = Component.displayName || Component.name;

  return componentName ? `${prefix}(${componentName})` : prefix;
}
