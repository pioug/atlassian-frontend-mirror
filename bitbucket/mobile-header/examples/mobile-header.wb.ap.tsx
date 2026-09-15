import { wb, type WorkbenchExample } from '@atlassian/workbench';
import { default as BasicExample } from './01-basic';
import { default as WithContentExample } from './02-with-content';
import { default as WithBannerExample } from './03-with-banner';

export const Basic: WorkbenchExample = wb(BasicExample);
export const WithContent: WorkbenchExample = wb(WithContentExample);
export const WithBanner: WorkbenchExample = wb(WithBannerExample);
