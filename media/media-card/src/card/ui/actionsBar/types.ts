import { type ReactNode } from 'react';
import { type CardAction } from '../../actions';

export interface ActionsBarProps {
  actions: Array<CardAction>;
  filename?: string;
  isFixed?: boolean;
}

export type ActionBarWrapperProps = {
  isFixed?: boolean;
  children?: ReactNode;
};
