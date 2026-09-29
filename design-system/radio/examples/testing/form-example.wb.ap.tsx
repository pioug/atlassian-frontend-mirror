import { wb, type WorkbenchExample } from '@atlassian/workbench';

import FormExampleExample from '../02-form-example.vr.ap';

export const FormExample: WorkbenchExample<typeof FormExampleExample> = wb(FormExampleExample);
