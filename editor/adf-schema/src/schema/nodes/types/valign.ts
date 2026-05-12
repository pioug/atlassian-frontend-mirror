export type Valign = 'top' | 'middle' | 'bottom';

/**
 * Parses a raw DOM attribute string into a valid {@link Valign}, or `undefined` if
 * the value is absent or not one of the allowed values.
 */
export const parseValign = (raw: string | null): Valign | undefined => {
	switch (raw) {
		case 'top':
		case 'middle':
		case 'bottom':
			return raw;
		default:
			return undefined;
	}
};
