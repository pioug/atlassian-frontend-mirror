import { createTransformer } from '@atlaskit/codemod-utils';

import convertTriggerType from './migrates/convert-trigger-type';
import deprecateItems from './migrates/deprecate-items';
import deprecateOnItemActivated from './migrates/deprecate-onItemActivated';
import deprecateOnPositioned from './migrates/deprecate-onPositioned';
import deprecateShouldFitContainer from './migrates/deprecate-shouldFitContainer';
import {
  renameDropdownItemGroupCheckbox,
  renameDropdownItemGroupRadio,
  renameDropdownMenuStateless,
} from './migrates/rename-imports';
import updatePositionValue from './migrates/replace-position-to-placement';
import replaceShouldAllowMultiline from './migrates/replace-shouldAllowMultiline';
import {
  updateDropdownItemGroupCheckboxCallsite,
  updateDropdownItemGroupRadioCallsite,
} from './migrates/update-component-callsites';

const transformer = createTransformer([
  deprecateItems,
  deprecateOnItemActivated,
  deprecateOnPositioned,
  deprecateShouldFitContainer,

  replaceShouldAllowMultiline,
  updatePositionValue,

  renameDropdownItemGroupCheckbox,
  renameDropdownItemGroupRadio,
  renameDropdownMenuStateless,

  updateDropdownItemGroupCheckboxCallsite,
  updateDropdownItemGroupRadioCallsite,

  convertTriggerType,
]);

export default transformer;
