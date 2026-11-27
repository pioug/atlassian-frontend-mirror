/* eslint-disable @atlaskit/volt-strict-mode/no-multiple-exports -- Catalog types file: one inferred props type per component plus the name/instance unions (mirrors `../v0_9/types.ts`). */

/**
 * Inferred prop types for the Agentic Forge v0.9 catalog
 * (`com.atlassian.agentic-forge/v0_9/v1`).
 */

import type { z } from 'zod';

import type { MultipleChoiceSchema, ResultPanelSchema } from './schemas';

export type AgenticForgeV09MultipleChoiceProps = z.infer<typeof MultipleChoiceSchema>;
export type AgenticForgeV09ResultPanelProps = z.infer<typeof ResultPanelSchema>;

/**
 * One flat `updateComponents` entry for this catalog, the shape
 * `createSurface({ components })` accepts. `component` is the catalog name
 * and the remaining fields are that component's props.
 */
export type AgenticForgeV09ComponentInstance =
	| ({
			component: 'MultipleChoice';
			id: string;
	  } & AgenticForgeV09MultipleChoiceProps)
	| {
			component: 'ResultPanel';
			id: string;
			summary: AgenticForgeV09ResultPanelProps['summary'];
			title: AgenticForgeV09ResultPanelProps['title'];
	  };

/**
 * Component names registered by this catalog.
 */
export type AgenticForgeV09ComponentName = 'MultipleChoice' | 'ResultPanel';
