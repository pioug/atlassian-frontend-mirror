import type { ADFMarkGroup } from '@atlaskit/adf-schema-generator';
import { adfMarkGroup } from '@atlaskit/adf-schema-generator';
import { link } from '../marks/link';

export const linkMarkGroup: ADFMarkGroup = adfMarkGroup('link', [link]);
