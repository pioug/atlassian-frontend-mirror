import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../1-legacy-editor-migrator';

export const LegacyEditorMigrator: WorkbenchExample<typeof Example> = wb(Example);
