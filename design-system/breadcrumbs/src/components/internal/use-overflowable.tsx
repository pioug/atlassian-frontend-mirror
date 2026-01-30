import { useEffect, useState } from 'react';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default function useOverflowable(
	truncationWidth: number | undefined,
	buttonRefCurrent: HTMLButtonElement | HTMLAnchorElement | null,
	iconWidthAllowance: number,
): boolean[] {
	const shouldCheckWidth = truncationWidth && buttonRefCurrent;

	// Default to true to match hasOverflow = true default in Step component.
	// This should ensure the icon never appears and then quickly disappears
	const [hasOverflow, setOverflow] = useState(Boolean(shouldCheckWidth));
	const [showTooltip, setShowTooltip] = useState(false);

	// Need to recalculate on every render cycle as text/icons/width changing will change the outcome
	useEffect(() => {
		if (shouldCheckWidth) {
			// Calculate if the button width will be larger than the truncation width after allowing for icon widths.
			// The button having a width greater than the truncationWidth, with icons, indicates the icons should be hidden to avoid going over the width limit
			const shouldOverflow = buttonRefCurrent.clientWidth + iconWidthAllowance > truncationWidth;

			// The button width can already be equal to the truncationWidth which is an indicator that truncation is occurring and a tooltip should be displayed
			const shouldShowTooltip =
				buttonRefCurrent.clientWidth + iconWidthAllowance >= truncationWidth;

			setOverflow(shouldOverflow);
			setShowTooltip(shouldShowTooltip);
		} else {
			setOverflow(false);
			setShowTooltip(false);
		}
	}, [truncationWidth, buttonRefCurrent, iconWidthAllowance, shouldCheckWidth]);

	return [hasOverflow, showTooltip];
}
