import { wb, type WorkbenchExample } from '@atlassian/workbench';

import EditableExample from './0-editable';
import SmartFilmstripExample from './0-smart-filmstrip';
import PureComponentExample from './3-pure-component';

export const Editable: WorkbenchExample = wb(EditableExample);
export const SmartFilmstrip: WorkbenchExample = wb(SmartFilmstripExample);
export const PureComponent: WorkbenchExample = wb(PureComponentExample);
