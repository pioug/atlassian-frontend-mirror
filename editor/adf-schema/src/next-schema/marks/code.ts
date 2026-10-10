import type { ADFMark } from '@atlaskit/adf-schema-generator/adfMark';
import { adfMark } from '@atlaskit/adf-schema-generator/adfMark';
import type { ADFMarkSpec } from '@atlaskit/adf-schema-generator/types/ADFMarkSpec';

import { fontStyleGroup } from '../groups/fontStyleGroup';
import { linkMarkGroup } from '../groups/linkMarkGroup';
import { searchQueryMarkGroup } from '../groups/searchQueryMarkGroup';
import { colorGroup } from './color';

export const code: ADFMark<ADFMarkSpec> = adfMark('code').define({
	excludes: [fontStyleGroup, linkMarkGroup, searchQueryMarkGroup, colorGroup],
	inclusive: true,
});
