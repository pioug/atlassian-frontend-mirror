import { wb, type WorkbenchExample } from '@atlassian/workbench';
import BasicExample from './00-basic';
import BasicWithFailureExample from './01-basic-with-failure';
import BasicWithEditExample from './02-basic-with-edit';
import CreateLinkPickerExample from './03-create-link-picker';
import BasicWithHeroExample from './04-basic-with-hero';
import InlineCreateExample from './05-inline-create';

export const Basic: WorkbenchExample = wb(BasicExample);
export const BasicWithFailure: WorkbenchExample = wb(BasicWithFailureExample);
export const BasicWithEdit: WorkbenchExample = wb(BasicWithEditExample);
export const CreateLinkPicker: WorkbenchExample = wb(CreateLinkPickerExample);
export const BasicWithHero: WorkbenchExample = wb(BasicWithHeroExample);
export const InlineCreate: WorkbenchExample = wb(InlineCreateExample);
