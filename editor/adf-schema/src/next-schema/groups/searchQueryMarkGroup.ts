import { adfMarkGroup } from '@atlaskit/adf-schema-generator';
import { typeAheadQuery } from '../marks/typeAheadQuery';

export const searchQueryMarkGroup = adfMarkGroup('searchQuery', [typeAheadQuery]);
