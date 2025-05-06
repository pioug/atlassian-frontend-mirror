import { writeFileSync } from 'fs';
import { join } from 'path';

import { createSignedArtifact } from '@atlassian/codegen';

import { parseFile, toMarkdown } from './utils';

const path = `${process.cwd()}/src/services/main.ts`;

function writeToFile(markdown: string): void {
	const filePath = join(process.cwd(), 'docs', '0-intro.tsx');
	const template = `// prettier-ignore
import { md } from '@atlaskit/docs';

export default md\`
{CONTENT}
\`;
`;

	const content = template.replace('{CONTENT}', markdown);

	const signed_content = createSignedArtifact(
		content,
		'yarn workspace @atlaskit/teams-client generate:docs:teams-client',
	);

	writeFileSync(filePath, signed_content);
}

const parsedInfo = parseFile(path);
writeToFile(toMarkdown(parsedInfo));
