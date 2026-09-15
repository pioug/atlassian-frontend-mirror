import { createCssDeclarationProbe } from './supports-css-declaration';

/**
 * Separate from `supportsAnchorPositioning`: some browsers have anchor
 * positioning without anchor sizing.
 */
// Annotated rather than inferred: `--isolatedDeclarations` cannot emit a type
// for a `const` initialised from a call.
export const supportsAnchorSize: () => boolean = createCssDeclarationProbe({
	property: 'min-inline-size',
	value: 'anchor-size(self-inline)',
});
