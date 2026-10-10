import { adfMarkGroup } from '@atlaskit/adf-schema-generator/adfMarkGroup';
import type { ADFMarkGroup } from '@atlaskit/adf-schema-generator/types/ADFMarkGroup';

import { em } from '../marks/em';
import { strike } from '../marks/strike';
import { strong } from '../marks/strong';
import { subsup } from '../marks/subsup';
import { underline } from '../marks/underline';

export const fontStyleGroup: ADFMarkGroup = adfMarkGroup('fontStyle', [
	em,
	strike,
	strong,
	subsup,
	underline,
]);
