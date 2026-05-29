import type { Format } from 'style-dictionary';

import { createSignedArtifact } from '@atlassian/codegen';

import { typescriptFormatter } from './typescript-formatter';

const fileFormatter: Format['formatter'] = (args) =>
	createSignedArtifact(typescriptFormatter(args), `yarn build tokens`);

export default fileFormatter;
export { typescriptFormatter } from './typescript-formatter';
