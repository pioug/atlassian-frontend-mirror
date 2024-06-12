import type { Format } from 'style-dictionary';

import { createSignedArtifact } from '@atlassian/codegen';

import { cssVariableFormatter } from './css-variables';

const cssVariableAsModuleFormatter: Format['formatter'] = (args) => {
	const css = cssVariableFormatter(args);

	return `export default \`\n${css}\`;\n`;
};

const fileFormatter: Format['formatter'] = (args) =>
	createSignedArtifact(cssVariableAsModuleFormatter(args), `yarn build tokens`);

export default fileFormatter;
