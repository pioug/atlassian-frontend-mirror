import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingInlineEditEscapeInLayerExample from '../15-testing-inline-edit-escape-in-layer';

export const TestingInlineEditEscapeInLayer: WorkbenchExample<
	typeof TestingInlineEditEscapeInLayerExample
> = wb(TestingInlineEditEscapeInLayerExample);
