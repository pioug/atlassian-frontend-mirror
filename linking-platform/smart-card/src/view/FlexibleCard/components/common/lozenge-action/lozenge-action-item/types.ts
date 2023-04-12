import { LozengeItem } from '../types';

export type LozengeActionItemProps = LozengeItem & {
  onClick?: (id: string) => void;
  testId?: string;
};
