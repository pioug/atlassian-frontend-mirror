import { ElementProps } from '../types';

export type LozengeAppearance =
  | 'default'
  | 'inprogress'
  | 'moved'
  | 'new'
  | 'removed'
  | 'success';

export type LozengeProps = ElementProps & {
  appearance?: LozengeAppearance;
  text?: string;
};
