import { ComponentType, ReactNode } from 'react';

export type BadgeProps = {
  id: string;
  badge: ComponentType<{}>;
  children: ReactNode;
};
