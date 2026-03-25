/**
 * Fully-resolved placement (internal). All fields are required.
 * Use getPlacement({ placement: partial }) to obtain from partial input.
 */
export type TPlacement = {
	axis: 'block' | 'inline';
	edge: 'start' | 'end';
	align: 'start' | 'center' | 'end';
};

/**
 * Resolves a partial placement to its fully-specified form.
 * Defaults: `axis: 'block'`, `edge: 'end'`, `align: 'center'`.
 */
export function getPlacement({ placement }: { placement: Partial<TPlacement> }): TPlacement {
	return {
		axis: placement.axis ?? 'block',
		edge: placement.edge ?? 'end',
		align: placement.align ?? 'center',
	};
}
