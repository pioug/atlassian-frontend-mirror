/**
 * Component APIs that make up the Agentic Jira v0.9 catalog
 * (`com.atlassian.agentic-jira/v0_9/v1`): every ADS base component plus the
 * agentic-workflow composites.
 *
 * This is the React-free source of truth for catalog membership. The renderer's
 * `createAgenticJiraCatalog()` must implement exactly these components and the published
 * `catalog.json` is generated from this list.
 */
import type { ComponentApi } from '@a2ui/web_core/v0_9';

import { CodeDiffApi } from '../v0_9/apis';
import { ADS_CATALOG_COMPONENT_APIS } from '../v0_9/catalog-component-apis';
import { MultipleChoiceQuestionsApi, RepositoryPickerApi, ToolApprovalApi } from './apis';

export const AGENTIC_JIRA_CATALOG_COMPONENT_APIS: ReadonlyArray<ComponentApi> = [
	...ADS_CATALOG_COMPONENT_APIS,
	CodeDiffApi,
	MultipleChoiceQuestionsApi,
	RepositoryPickerApi,
	ToolApprovalApi,
];
