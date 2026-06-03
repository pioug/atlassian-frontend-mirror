/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useLayoutEffect } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

/**
 * RTL VR fixture: forces the document into `dir="rtl"` and renders two
 * tooltips (`position="right"` and `position="mouse"` + `mousePosition="right"`).
 * Both should appear on the physical-left of their anchor in the snapshot,
 * proving inline-end placement flips correctly in RTL.
 */
const layoutStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: token('space.200'),
  flexDirection: 'column',
  paddingBlockEnd: token('space.200'),
  paddingBlockStart: token('space.200'),
  paddingInlineEnd: token('space.200'),
  paddingInlineStart: token('space.200')
});

export default function VrPositionRtlExample(): React.JSX.Element {
	// Set `dir` on `<html>` (not a wrapper `<div>`) because the popover
	// renders in the top layer and only shares `<html>` with the trigger.
	// Restore on unmount so RTL state does not leak into adjacent tests.
	useLayoutEffect(() => {
		const htmlEl = document.documentElement;
		const previous = htmlEl.getAttribute('dir');
		htmlEl.setAttribute('dir', 'rtl');
		return () => {
			if (previous === null) {
				htmlEl.removeAttribute('dir');
			} else {
				htmlEl.setAttribute('dir', previous);
			}
		};
	}, []);

	return (
		<div css={layoutStyles}>
			<Tooltip
				content="Tooltip on right (RTL → physical-left)"
				position="right"
				testId="tooltip-rtl-position-right"
			>
				{(tooltipProps) => (
					<Button {...tooltipProps} testId="trigger-rtl-position-right">
						position=right
					</Button>
				)}
			</Tooltip>

			<Tooltip
				content="Tooltip at mouse, mousePosition=right (RTL → physical-left)"
				position="mouse"
				mousePosition="right"
				testId="tooltip-rtl-mouse-right"
			>
				{(tooltipProps) => (
					<Button {...tooltipProps} testId="trigger-rtl-mouse-right">
						position=mouse, mousePosition=right
					</Button>
				)}
			</Tooltip>
		</div>
	);
}
