import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExample from './0-basic';
import WithCustomToolbarExample from './1-with-custom-toolbar';
import RealProviderExample from './3-real-provider';

export const Basic: WorkbenchExample = wb(BasicExample);
export const WithCustomToolbar: WorkbenchExample = wb(WithCustomToolbarExample);
export const RealProvider: WorkbenchExample = wb(RealProviderExample);
