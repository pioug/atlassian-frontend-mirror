import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExample from './0-basic';
import BasicImageExampleSource from './0-basic-image-example';
import SsrExample from './1-ssr';

export const BasicImageExample: WorkbenchExample = wb(BasicImageExampleSource);
export const Basic: WorkbenchExample = wb(BasicExample);
export const Ssr: WorkbenchExample = wb(SsrExample);
