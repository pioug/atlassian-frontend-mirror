import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicVrExample from './0-basic.vr.ap';
import OverflowExample from './1-overflow';
import RoundedExample from './2-rounded';
import TagHandlersExample from './3-tag-handlers';
import RemoveButtonLabelExample from './4-remove-button-label';
import AddTagsExample from './5-add-tags';

const BasicVr: WorkbenchExample = wb(BasicVrExample);

export default BasicVr;
export const Overflow: WorkbenchExample = wb(OverflowExample);
export const Rounded: WorkbenchExample = wb(RoundedExample);
export const TagHandlers: WorkbenchExample = wb(TagHandlersExample);
export const RemoveButtonLabel: WorkbenchExample = wb(RemoveButtonLabelExample);
export const AddTags: WorkbenchExample = wb(AddTagsExample);
