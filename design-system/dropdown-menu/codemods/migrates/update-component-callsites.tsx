import { createUpdateCallsite } from '../utils/create-update-callsite';

export const updateDropdownItemGroupCheckboxCallsite = createUpdateCallsite({
  componentName: 'DropdownItemGroupCheckbox',
  newComponentName: 'DropdownItemCheckboxGroup',
  packagePath: '@atlaskit/dropdown-menu',
});

export const updateDropdownItemGroupRadioCallsite = createUpdateCallsite({
  componentName: 'DropdownItemGroupRadio',
  newComponentName: 'DropdownItemRadioGroup',
  packagePath: '@atlaskit/dropdown-menu',
});
