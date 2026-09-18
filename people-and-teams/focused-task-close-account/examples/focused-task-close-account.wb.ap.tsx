import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as BasicDrawerAssemblyExample } from './00-BasicDrawerAssembly';
import { default as DeleteUserDrawerExample } from './01-DeleteUserDrawer';
import { default as SingleScreenDrawerExample } from './02-SingleScreenDrawer';
import { default as DeactivateDrawerExample } from './03-DeactivateDrawer';

export const BasicDrawerAssembly: WorkbenchExample = wb(BasicDrawerAssemblyExample);
export const DeleteUserDrawer: WorkbenchExample = wb(DeleteUserDrawerExample);
export const SingleScreenDrawer: WorkbenchExample = wb(SingleScreenDrawerExample);
export const DeactivateDrawer: WorkbenchExample = wb(DeactivateDrawerExample);
