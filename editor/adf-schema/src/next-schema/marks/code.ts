import type { ADFMark, ADFMarkSpec } from '@atlaskit/adf-schema-generator';
import { adfMark } from '@atlaskit/adf-schema-generator';
import { fontStyleGroup } from '../groups/fontStyleGroup';
import { linkMarkGroup } from '../groups/linkMarkGroup';
import { searchQueryMarkGroup } from '../groups/searchQueryMarkGroup';
import { colorGroup } from './color';

export const code: ADFMark<ADFMarkSpec> = adfMark('code').define({
	excludes: [fontStyleGroup, linkMarkGroup, searchQueryMarkGroup, colorGroup],
	inclusive: true,
});
