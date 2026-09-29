import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as MediaWrapperExample } from '../12-media-wrapper';

export const MediaWrapper: WorkbenchExample<typeof MediaWrapperExample> = wb(MediaWrapperExample);
