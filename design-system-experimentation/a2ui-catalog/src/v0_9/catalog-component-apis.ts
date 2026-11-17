/**
 * Component APIs that make up the ADS v0.9 catalog (`com.atlassian.ads/v0_9`).
 *
 * This is the React-free source of truth for catalog membership. The renderer's
 * `ADS_CATALOG_ADAPTERS` must implement exactly these components and the published
 * `catalog.json` is generated from this list.
 *
 * `CodeDiffApi` is intentionally absent: `CodeDiff` belongs to the Agentic Jira
 * catalog only.
 */
import type { ComponentApi } from '@a2ui/web_core/v0_9';

import {
	ButtonApi,
	CardApi,
	CardBodyApi,
	CardContentApi,
	CardDescriptionApi,
	CardFooterApi,
	CardHeaderApi,
	CardLeadingApi,
	CardMediaApi,
	CardPrimaryContentApi,
	CardTitleApi,
	CheckBoxApi,
	ColumnApi,
	FieldApi,
	FormApi,
	FormFooterApi,
	FormHeaderApi,
	FormSectionApi,
	MultipleChoiceApi,
	RowApi,
	TextApi,
	TextFieldApi,
} from './apis';

export const ADS_CATALOG_COMPONENT_APIS: ReadonlyArray<ComponentApi> = [
	ButtonApi,
	TextApi,
	RowApi,
	ColumnApi,
	CheckBoxApi,
	CardApi,
	CardMediaApi,
	CardContentApi,
	CardLeadingApi,
	CardPrimaryContentApi,
	CardHeaderApi,
	CardTitleApi,
	CardDescriptionApi,
	CardBodyApi,
	CardFooterApi,
	TextFieldApi,
	MultipleChoiceApi,
	FormApi,
	FieldApi,
	FormSectionApi,
	FormHeaderApi,
	FormFooterApi,
];
