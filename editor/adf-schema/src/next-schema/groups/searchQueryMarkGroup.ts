import type { ADFMarkGroup } from '@atlaskit/adf-schema-generator';
import { adfMarkGroup } from '@atlaskit/adf-schema-generator';
import { typeAheadQuery } from '../marks/typeAheadQuery';

export const searchQueryMarkGroup: ADFMarkGroup = adfMarkGroup('searchQuery', [typeAheadQuery]);
