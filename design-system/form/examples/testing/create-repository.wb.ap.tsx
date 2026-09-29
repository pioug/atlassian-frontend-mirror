import { wb, type WorkbenchExample } from '@atlassian/workbench';

import CreateRepositoryExample from '../06-create-repository.vr.ap';

export const CreateRepository: WorkbenchExample<typeof CreateRepositoryExample> =
	wb(CreateRepositoryExample);
