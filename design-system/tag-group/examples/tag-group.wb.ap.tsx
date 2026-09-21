import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicVrExample from './0-basic.vr.ap';
import OverflowExample from './1-overflow';
import RoundedExample from './2-rounded';
import TagHandlersExample from './3-tag-handlers';
import RemoveButtonLabelExample from './4-remove-button-label';
import AddTagsExample from './5-add-tags';

// Explicit named export Used to generate integration-test URLs.
export const Basic: WorkbenchExample = wb(BasicVrExample);
// Default export required by accessibility tooling.
export default Basic;
export const Overflow: WorkbenchExample = wb(OverflowExample);
export const Rounded: WorkbenchExample = wb(RoundedExample);
export const TagHandlers: WorkbenchExample = wb(TagHandlersExample);
export const RemoveButtonLabel: WorkbenchExample = wb(RemoveButtonLabelExample);
export const AddTags: WorkbenchExample = wb(AddTagsExample);
