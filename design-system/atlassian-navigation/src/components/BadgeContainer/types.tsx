import { ComponentType, ReactNode } from 'react';

export type BadgeProps = {
  id: string;
  badge: ComponentType<{}>;
  children: ReactNode;

  /**
   * Used to override the accessibility role for the element.
   */
  role?: 'presentation' | 'listitem';
};
