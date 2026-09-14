import { createSignedArtifact } from '@atlassian/codegen';
import type { Format } from 'style-dictionary';

import { typescriptTokenPairingsFormatter } from './typescript-token-pairings-formatter';

const fileFormatter: Format['formatter'] = (args) =>
	createSignedArtifact(
		typescriptTokenPairingsFormatter(args),
		`yarn build tokens`,
		`Auto-generated list of token pairings that may need to have sufficient contrast.
  Not currently used by tests, but is used by the custom theme contrast checker example`,
	);

export default fileFormatter;
