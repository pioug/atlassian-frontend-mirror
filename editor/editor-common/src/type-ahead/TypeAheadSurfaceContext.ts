import type { ContextToken } from '@atlaskit/editor-ui-control-model/types';

/**
 * Immutable context used while resolving a TypeAhead surface.
 */
export type TypeAheadSurfaceContext = {
	readonly menuOpenId: symbol;
};

export const TYPE_AHEAD_SURFACE_CONTEXT = Symbol(
	'type-ahead-surface-context',
) as ContextToken<TypeAheadSurfaceContext>;
