import { wb, type WorkbenchExample } from '@atlassian/workbench';

import RadioDefaultExample from './00-radio-default';
import ControlledExampleSource from './01-controlled-example';
import FormExampleVrExample from './02-form-example.vr.ap';
import DefaultCheckedValueExample from './03-default-checked-value';
import RadioWithoutGroupExample from './04-radio-without-group';
import RadioInvalidExample from './06-radio-invalid';
import TestingExample from './99-testing';

const RadioDefault: WorkbenchExample = wb(RadioDefaultExample);

export default RadioDefault;
export const ControlledExample: WorkbenchExample = wb(ControlledExampleSource);
export const FormExampleVr: WorkbenchExample = wb(FormExampleVrExample);
export const DefaultCheckedValue: WorkbenchExample = wb(DefaultCheckedValueExample);
export const RadioWithoutGroup: WorkbenchExample = wb(RadioWithoutGroupExample);
export const RadioInvalid: WorkbenchExample = wb(RadioInvalidExample);
export const Testing: WorkbenchExample = wb(TestingExample);
