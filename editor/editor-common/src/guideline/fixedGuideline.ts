
import { createGuidesFromLengths } from './createGuidesFromLengths';

/**
 * This creates a Guideline configuration generating a collection of guideline pairs from each supplied length value.
 * Each length value generates a guideline config for both the left and right side of the length.
 * When length is 0, generate a guideline at position: {x: 0}
 *
 */
export const createFixedGuidelinesFromLengths = (
	lengths: number[],
	key: string = 'guide',
	hasFullWidthGuide: boolean = false,
): { key: string; position: { x: number } }[] => {
	return createGuidesFromLengths(lengths, hasFullWidthGuide).reduce<
		{ key: string; position: { x: number } }[]
	>((acc, { left, right, length, isFullWidth }) => {
		if (length === 0) {
			return [
				...acc,
				{
					key: `${key}-${length}-centre`,
					position: {
						x: left,
					},
				},
			];
		} else {
			return [
				...acc,
				{
					key: `${key}-${length}-left`,
					position: {
						x: left,
					},
				},
				{
					key: `${key}-${length}-right`,
					position: {
						x: right,
					},
					...(isFullWidth ? { isFullWidth: true } : {}),
				},
			];
		}
	}, []);
};
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { createGuidesFromLengths } from './createGuidesFromLengths';
