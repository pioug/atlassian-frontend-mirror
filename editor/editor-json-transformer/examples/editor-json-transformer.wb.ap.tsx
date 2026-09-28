import { wb, type WorkbenchExample } from '@atlassian/workbench';

import JsonTransformerExample from './0-json-transformer';
import LayoutsExample from './1-layouts';

export const JsonTransformer: WorkbenchExample<typeof JsonTransformerExample> =
	wb(JsonTransformerExample);
export const Layouts: WorkbenchExample<typeof LayoutsExample> = wb(LayoutsExample);
