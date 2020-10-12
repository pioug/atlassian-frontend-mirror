import { ComponentType, ReactNode } from 'react';

export type BadgeProps = {
  badge: ComponentType<{}>;
  children: ReactNode;
};
