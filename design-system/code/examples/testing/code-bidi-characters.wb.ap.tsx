import { wb, type WorkbenchExample } from '@atlassian/workbench';

import CodeBidiCharactersExample from '../22-code-bidi-characters.vr.ap';

export const CodeBidiCharacters: WorkbenchExample<typeof CodeBidiCharactersExample> =
	wb(CodeBidiCharactersExample);
