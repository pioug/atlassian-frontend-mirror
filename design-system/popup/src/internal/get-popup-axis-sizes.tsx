import type { TAnchoredPopoverOptions } from '@atlaskit/top-layer/use-anchored-popover';

type TPopupAxisSize = NonNullable<TAnchoredPopoverOptions['inlineSize']>;

/**
 * Maps the legacy `shouldFitContainer` / `shouldFitViewport` pair onto
 * `useAnchoredPopover`'s per-axis sizes. Shared by the standard and the
 * compositional adapter so the two cannot drift.
 *
 * Both props can be set together while `inlineSize` takes one value, so
 * `shouldFitContainer` wins the inline axis, being the more specific request.
 * Fitting then applies to the block axis only, and still turns the
 * placement-axis floor on, so a cramped popup flips rather than letterboxing.
 *
 * Known cost on a `left-*` / `right-*` placement: the anchor floor is unclamped
 * so it can drive the flip, and a min beats a max, so a trigger wider than the
 * viewport is floored past the viewport cap. Not new, and not reconciled - see
 * `@atlaskit/top-layer`'s `notes/decisions/width-from-anchor-floors.md`.
 */
export function getPopupAxisSizes({
	shouldFitContainer,
	shouldFitViewport,
}: {
	shouldFitContainer: boolean;
	shouldFitViewport: boolean;
}): { inlineSize: TPopupAxisSize; blockSize: TPopupAxisSize } {
	const blockSize: TPopupAxisSize = shouldFitViewport ? 'max-available' : 'content';
	if (shouldFitContainer) {
		return { inlineSize: 'match-anchor', blockSize };
	}
	if (shouldFitViewport) {
		return { inlineSize: 'max-available', blockSize };
	}
	return { inlineSize: 'content', blockSize };
}
