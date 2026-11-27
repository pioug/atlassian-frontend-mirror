/**
 * Every A2UI catalog owned by this package. Each entry is published as a
 * standalone `catalog.json` under `catalogs/<slug>/catalog.json`.
 *
 * Add new catalogs here: the generator and the drift test iterate this list,
 * so a catalog that is not listed here has no published JSON. Set `isPrivate`
 * to publish a catalog in the npm package while omitting it from public docs.
 */
import type { ComponentApi } from '@a2ui/web_core/v0_9';

import { AGENTIC_FORGE_CATALOG_COMPONENT_APIS } from '../agentic-forge-v0_9/catalog-component-apis';
import { AGENTIC_FORGE_CATALOG_ID } from '../agentic-forge-v0_9/catalog-id';
import { AGENTIC_JIRA_CATALOG_COMPONENT_APIS } from '../agentic-jira-v0_9/catalog-component-apis';
import { AGENTIC_JIRA_CATALOG_ID } from '../agentic-jira-v0_9/catalog-id';
import { ADS_CATALOG_COMPONENT_APIS } from '../v0_9/catalog-component-apis';
import { ADS_CATALOG_ID } from '../v0_9/catalog-id';

export type CatalogDefinition = {
	/** Wire identifier agents pass to `createSurface({ catalogId })`. */
	catalogId: string;
	components: ReadonlyArray<ComponentApi>;
	description: string;
	/** Guidance for agents authoring surfaces against this catalog. */
	instructions: string;
	/**
	 * When true, the catalog JSON is still published in the npm package and
	 * omitted from public documentation.
	 */
	isPrivate?: boolean;
	/** Directory name under `catalogs/`. Must be unique and filesystem-safe. */
	slug: string;
	title: string;
};

const COMMON_INSTRUCTIONS =
	'Send A2UI v0.9 messages, each with "version": "v0.9". Start with createSurface using this catalogId, then send updateComponents with a flat list of components. Each component needs a unique id and a component name from this catalog; reference children by id. Exactly one component must have the id "root". Use data bindings ({ "path": "/json/pointer" }) for values the user can change, and send updateDataModel to set initial values.';

const FORGE_INSTRUCTIONS =
	'Send A2UI v0.9 messages, each with "version": "v0.9". Start with createSurface using this catalogId, then send updateComponents. This catalog contains ResultPanel and MultipleChoice. It is not a superset of the ADS catalog. ResultPanel is a completed result: set component to "ResultPanel" and provide title and summary as literal strings. summary keeps authored line breaks. Do not add actions, data-binding path objects, or child component ids to ResultPanel. MultipleChoice chooses one or more options. Set options to an array of { label, value }. Set value to a string array or a { "path": "/json/pointer" } binding; the renderer writes the selected values back to that path. style is "select" (default) or "action". Use updateDataModel to seed a bound MultipleChoice value. Do not invent other component names.';

export const CATALOG_DEFINITIONS: ReadonlyArray<CatalogDefinition> = [
	{
		catalogId: ADS_CATALOG_ID,
		slug: 'ads-v0_9',
		title: 'Atlassian Design System A2UI catalog',
		description:
			'A2UI v0.9 components rendered with the Atlassian Design System: text, layout, cards, inputs, and forms.',
		instructions: COMMON_INSTRUCTIONS,
		components: ADS_CATALOG_COMPONENT_APIS,
	},
	{
		catalogId: AGENTIC_JIRA_CATALOG_ID,
		slug: 'agentic-jira-v0_9-v1',
		title: 'Atlassian Agentic Jira A2UI catalog',
		description:
			'Every ADS catalog component plus agentic-workflow components for Jira: code diffs, multiple-choice questions, repository picking, and tool approval.',
		instructions: `${COMMON_INSTRUCTIONS} When producing code changes, use CodeDiff to display file-level diffs with each patch in unified diff format. For modified files, include oldText and newText when available so unchanged lines can be expanded. Set mode to "compact" for chat sidebars and "full" for full-screen views.`,
		components: AGENTIC_JIRA_CATALOG_COMPONENT_APIS,
	},
	{
		catalogId: AGENTIC_FORGE_CATALOG_ID,
		slug: 'agentic-forge-v0_9-v1',
		title: 'Atlassian Agentic Forge A2UI catalog',
		isPrivate: true,
		description:
			'A dedicated Forge catalog. ResultPanel shows a completed result from a literal title and summary. MultipleChoice selects one or more options. It is not a superset of the ADS catalog.',
		instructions: FORGE_INSTRUCTIONS,
		components: AGENTIC_FORGE_CATALOG_COMPONENT_APIS,
	},
];
