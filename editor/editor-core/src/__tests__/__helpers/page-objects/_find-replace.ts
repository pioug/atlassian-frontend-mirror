import { searchMatchClass } from '../../../plugins/find-replace/styles';

export const findReplaceSelectors = {
  toolbarButton: '[aria-label="Find and replace"]',
  replaceInput: 'input[name="replace"]',
  replaceButton: '[data-testid="Replace"]',
  findInput: 'input[name="find"]',
  decorations: `.${searchMatchClass}`,
};
