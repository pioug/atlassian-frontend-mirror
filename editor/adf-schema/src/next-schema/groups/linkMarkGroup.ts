import { adfMarkGroup } from '@atlaskit/adf-schema-generator/adfMarkGroup';
import type { ADFMarkGroup } from '@atlaskit/adf-schema-generator/types/ADFMarkGroup';

import { link } from '../marks/link';

export const linkMarkGroup: ADFMarkGroup = adfMarkGroup('link', [link]);
