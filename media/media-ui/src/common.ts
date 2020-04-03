export type LozengeColor =
  | 'default'
  | 'success'
  | 'removed'
  | 'inprogress'
  | 'new'
  | 'moved';
export interface LozengeProps {
  text: string;
  appearance?: LozengeColor; // defaults to 'default'
  isBold?: boolean; // defaults to false
}
