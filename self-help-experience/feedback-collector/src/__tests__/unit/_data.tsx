import { OptionType } from '../../components/FeedbackForm';
import { SelectOptionDetails, SelectValue } from '../../types';

export const defaultFieldRecords: Record<SelectValue, SelectOptionDetails> = {
  question: {
    fieldLabel: 'What would you like to know?',
    selectOptionLabel: 'question select option label',
  },
  comment: {
    fieldLabel: "Let us know what's on your mind",
    selectOptionLabel: 'comment select option label',
  },
  bug: {
    fieldLabel: 'Describe the bug or issue',
    selectOptionLabel: 'bug select option label',
  },
  suggestion: {
    fieldLabel: "Let us know what you'd like to improve",
    selectOptionLabel: 'suggestion select option label',
  },
  empty: {
    fieldLabel: 'Select an option',
    selectOptionLabel: 'empty select option label',
  },
};

export const customFieldRecords: Record<SelectValue, SelectOptionDetails> = {
  ...defaultFieldRecords,
  suggestion: {
    fieldLabel: 'A field label',
    selectOptionLabel: 'A select option label',
  },
};

export const customOptionsData: OptionType[] = [
  {
    label: 'question select option label',
    value: 'question',
  },
  {
    label: 'comment select option label',
    value: 'comment',
  },
  {
    label: 'bug select option label',
    value: 'bug',
  },
  {
    label: 'A select option label',
    value: 'suggestion',
  },
];

export const emptyOptionData: OptionType = {
  label: 'empty select option label',
  value: 'empty',
};
