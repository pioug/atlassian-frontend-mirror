import { token } from '@atlaskit/tokens';

import { getPlacement, type TPlacementOptions } from '../internal/resolve-placement';

export function getPopupMotionStyles({
	placement,
}: {
	placement: TPlacementOptions;
}): Array<{ property: string; value: string }> {
	const { axis, edge } = getPlacement({ placement });

	if (axis === 'block' && edge === 'start') {
		return [
			{ property: '--ds-popover-motion-enter', value: token('motion.popup.enter.top') },
			{ property: '--ds-popover-motion-exit', value: token('motion.popup.exit.top') },
		];
	}
	if (axis === 'inline' && edge === 'start') {
		return [
			{ property: '--ds-popover-motion-enter', value: token('motion.popup.enter.left') },
			{ property: '--ds-popover-motion-exit', value: token('motion.popup.exit.left') },
		];
	}
	if (axis === 'inline' && edge === 'end') {
		return [
			{ property: '--ds-popover-motion-enter', value: token('motion.popup.enter.right') },
			{ property: '--ds-popover-motion-exit', value: token('motion.popup.exit.right') },
		];
	}
	// Default: block/end (popover below trigger)
	return [
		{ property: '--ds-popover-motion-enter', value: token('motion.popup.enter.bottom') },
		{ property: '--ds-popover-motion-exit', value: token('motion.popup.exit.bottom') },
	];
}
