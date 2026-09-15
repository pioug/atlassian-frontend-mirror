import { createCssDeclarationProbe } from './supports-css-declaration';

/**
 * Probes `anchor-name` and NOT `anchor-size()`: some browsers have positioning
 * without sizing, which is what `supportsAnchorSize` is for.
 */
// Annotated rather than inferred: `--isolatedDeclarations` cannot emit a type
// for a `const` initialised from a call.
export const supportsAnchorPositioning: () => boolean = createCssDeclarationProbe({
	property: 'anchor-name',
	value: '--a',
});
