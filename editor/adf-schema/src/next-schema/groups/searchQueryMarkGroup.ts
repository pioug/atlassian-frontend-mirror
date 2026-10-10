import { adfMarkGroup } from '@atlaskit/adf-schema-generator/adfMarkGroup';
import type { ADFMarkGroup } from '@atlaskit/adf-schema-generator/types/ADFMarkGroup';

import { typeAheadQuery } from '../marks/typeAheadQuery';

export const searchQueryMarkGroup: ADFMarkGroup = adfMarkGroup('searchQuery', [typeAheadQuery]);
