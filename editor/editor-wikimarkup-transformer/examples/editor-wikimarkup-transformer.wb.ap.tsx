import { wb, type WorkbenchExample } from '@atlassian/workbench';

import AdfToWikimarkupExample from './0-adf-to-wikimarkup';
import WikimarkupToAdfExample from './1-wikimarkup-to-adf';
import WikimarkupEditorExample from './2-wikimarkup-editor';

export const AdfToWikimarkup: WorkbenchExample = wb(AdfToWikimarkupExample);
export const WikimarkupToAdf: WorkbenchExample = wb(WikimarkupToAdfExample);
export const WikimarkupEditor: WorkbenchExample = wb(WikimarkupEditorExample);
