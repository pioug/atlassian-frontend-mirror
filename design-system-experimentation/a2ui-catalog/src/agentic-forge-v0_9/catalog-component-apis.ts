/**
 * Component APIs that make up the Agentic Forge v0.9 catalog
 * (`com.atlassian.agentic-forge/v0_9/v1`).
 *
 * This is the React-free source of truth for catalog membership. The renderer's
 * `createAgenticForgeCatalog()` must implement exactly these components and the published
 * `catalog.json` is generated from this list.
 */
import type { ComponentApi } from '@a2ui/web_core/v0_9';

import { ResultPanelApi } from './apis';

export const AGENTIC_FORGE_CATALOG_COMPONENT_APIS: ReadonlyArray<ComponentApi> = [ResultPanelApi];
