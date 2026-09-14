import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExample from './1-basic';
import RegistrySurfacesExample from './2-registry-surfaces';

export const Basic: WorkbenchExample = wb(BasicExample);
export const RegistrySurfaces: WorkbenchExample = wb(RegistrySurfacesExample);
