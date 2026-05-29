import type { Format } from 'style-dictionary';

import { createSignedArtifact } from '@atlassian/codegen';

import { cssVariableFormatter } from './css-variable-formatter';

const fileFormatter: Format['formatter'] = (args) =>
	createSignedArtifact(cssVariableFormatter(args), `yarn build tokens`);

export default fileFormatter;
export { cssVariableFormatter } from './css-variable-formatter';
