import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as BasicExample } from './01-basic';
import { default as WithContentExample } from './02-with-content';
import { default as WithBannerExample } from './03-with-banner';

export const Basic: WorkbenchExample<typeof BasicExample> = wb(BasicExample);
export const WithContent: WorkbenchExample<typeof WithContentExample> = wb(WithContentExample);
export const WithBanner: WorkbenchExample<typeof WithBannerExample> = wb(WithBannerExample);
