export type SelectValue =
  | 'bug'
  | 'comment'
  | 'suggestion'
  | 'question'
  | 'empty';

export interface FormFields {
  type: SelectValue;
  description: string;
  canBeContacted: boolean;
  enrollInResearchGroup: boolean;
}
