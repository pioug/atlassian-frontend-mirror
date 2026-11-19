import React from 'react';

import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as AddContainerCardExampleSource } from './AddContainerCard.example';
import { default as ContainerIconExampleSource } from './ContainerIcon.example';
import { default as CustomComponentsExampleSource } from './CustomComponents.example';
import { default as SeparatorExampleSource } from './Separator.example';
import {
	default as TeamContainersExampleSource,
	TeamContainersPlayground,
} from './TeamContainers.example';
import { default as TeamContainerSkeletonExampleSource } from './TeamContainerSkeleton.example';
import { default as TeamLinkCardExampleSource } from './TeamLinkCard.example';

export const AddContainerCardExample: WorkbenchExample = wb(AddContainerCardExampleSource);
export const ContainerIconExample: WorkbenchExample = wb(ContainerIconExampleSource);
export const CustomComponentsExample: WorkbenchExample = wb(CustomComponentsExampleSource);
export const SeparatorExample: WorkbenchExample = wb(SeparatorExampleSource);
export const TeamContainerSkeletonExample: WorkbenchExample = wb(
	TeamContainerSkeletonExampleSource,
);
export const TeamContainersExample: WorkbenchExample = wb(TeamContainersExampleSource);
export const TeamLinkCardExample: WorkbenchExample = wb(TeamLinkCardExampleSource);

// No linked containers: the viewer with product access sees only the Jira, Confluence, Loom
// and web link add cards; the viewer without access sees the no-product-access state.
export const TeamContainersAddCardsOnlyExample: WorkbenchExample = wb(() => (
	<TeamContainersPlayground defaults={{ containers: 'none', productAccess: 'granted' }} />
));
export const TeamContainersNoProductAccessExample: WorkbenchExample = wb(() => (
	<TeamContainersPlayground defaults={{ containers: 'none', productAccess: 'denied' }} />
));
