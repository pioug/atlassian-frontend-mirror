import { createTransformer } from '@atlaskit/codemod-utils';

import convertTriggerType from './migrates/convert-trigger-type';
import deprecateAutoFocus from './migrates/deprecate-autoFocus';
import deprecateboundariesElement from './migrates/deprecate-boundariesElement';
import deprecateIsCompact from './migrates/deprecate-isCompact';
import deprecateIsHidden from './migrates/deprecate-isHidden';
import deprecateIsMenuFixed from './migrates/deprecate-isMenuFixed';
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
  deprecateboundariesElement,
  deprecateIsMenuFixed,

  // props on *Items
  ...deprecateAutoFocus(),
  ...deprecateIsCompact(),
  ...deprecateIsHidden(),

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
