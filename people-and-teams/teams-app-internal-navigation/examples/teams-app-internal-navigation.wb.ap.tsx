import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as TeamsAnchorExampleSource } from './TeamsAnchor.example';
import { default as TeamsLinkExampleSource } from './TeamsLink.example';
import { default as TeamsLinkButtonExampleSource } from './TeamsLinkButton.example';
import { default as TeamsLinkItemExampleSource } from './TeamsLinkItem.example';
import { default as TeamsNavigationProviderExampleSource } from './TeamsNavigationProvider.example';

export const TeamsAnchorExample: WorkbenchExample = wb(TeamsAnchorExampleSource);
export const TeamsLinkExample: WorkbenchExample = wb(TeamsLinkExampleSource);
export const TeamsLinkButtonExample: WorkbenchExample = wb(TeamsLinkButtonExampleSource);
export const TeamsLinkItemExample: WorkbenchExample = wb(TeamsLinkItemExampleSource);
export const TeamsNavigationProviderExample: WorkbenchExample = wb(
	TeamsNavigationProviderExampleSource,
);
