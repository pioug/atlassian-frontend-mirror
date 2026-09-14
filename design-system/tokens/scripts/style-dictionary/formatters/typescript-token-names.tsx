import { createSignedArtifact } from '@atlassian/codegen';
import type { Format } from 'style-dictionary';

import { typescriptTokenFormatter } from './typescript-token-formatter';

const fileFormatter: Format['formatter'] = (args) =>
	createSignedArtifact(typescriptTokenFormatter(args), `yarn build tokens`);

export default fileFormatter;
