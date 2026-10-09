import type { Format } from 'style-dictionary';

import { createSignedArtifact } from '@atlassian/codegen/signed-artifact';

import { typescriptTokenFormatter } from './typescript-token-formatter';

const fileFormatter: Format['formatter'] = (args) =>
	createSignedArtifact(typescriptTokenFormatter(args), `yarn build tokens`);

export default fileFormatter;
