import type { Modifier, ModifierArguments } from '@popperjs/core';

type MaxSizeData = {
	viewport: {
		width: number;
		height: number;
	};
};

export function getMaxSizeModifiers({ viewportPadding }: { viewportPadding: number }): [
	{
		/**
		 * Performing DOM measurements in the 'read' phase,
		 * which is the convention for popper modifiers
		 */
		readonly name: 'maxSizeData';
		readonly enabled: true;
		readonly phase: 'read';
		readonly fn: ({ state, name }: ModifierArguments<any>) => void;
	},
	{
		/**
		 * Applying max size CSS
		 */
		readonly name: 'maxSize';
		readonly enabled: true;
		readonly phase: 'beforeWrite';
		readonly requiresIfExists: ['offset', 'preventOverflow', 'flip'];
		readonly fn: ({ state }: ModifierArguments<any>) => void;
	},
] {
	return [
		{
			/**
			 * Performing DOM measurements in the 'read' phase,
			 * which is the convention for popper modifiers
			 */
			name: 'maxSizeData',
			enabled: true,
			phase: 'read',
			fn({ state, name }) {
				if (!window.visualViewport) {
					return;
				}

				state.modifiersData[name] = {
					viewport: {
						width: window.visualViewport.width,
						height: window.visualViewport.height,
					},
				};
			},
		},
		{
			/**
			 * Applying max size CSS
			 */
			name: 'maxSize',
			enabled: true,
			phase: 'beforeWrite',
			requiresIfExists: ['offset', 'preventOverflow', 'flip'],
			fn({ state }) {
				const data = state.modifiersData.maxSizeData as MaxSizeData | Record<string, undefined>;
				if (
					typeof data?.viewport?.width !== 'number' ||
					typeof data?.viewport?.height !== 'number'
				) {
					// This shouldn't occur in a real browser but might in non-browser test environments
					return;
				}

				const { viewport } = data;

				const { popperOffsets = { x: 0, y: 0 } } = state.modifiersData;

				const [basePlacement] = state.placement.split('-');

				const placementOffset = state.modifiersData?.offset?.[state.placement] ?? { x: 0, y: 0 };

				// By default we set these to the entire viewport (minus padding)
				// Each placement direction will overwrite one of these
				let maxWidth = viewport.width - 2 * viewportPadding;
				let maxHeight = viewport.height - 2 * viewportPadding;

				if (basePlacement === 'top') {
					maxHeight =
						state.rects.reference.y + // Viewport-relative position of reference element
						placementOffset.y - // Space between popper and reference
						viewportPadding;
				}

				if (basePlacement === 'bottom') {
					maxHeight =
						viewport.height -
						popperOffsets.y - // Viewport-relative position of popper
						viewportPadding;
				}

				if (basePlacement === 'left') {
					maxWidth =
						state.rects.reference.x + // Viewport-relative position of reference element
						placementOffset.x - // Space between popper and reference
						viewportPadding;
				}

				if (basePlacement === 'right') {
					maxWidth =
						viewport.width -
						popperOffsets.x - // Viewport-relative position of popper
						viewportPadding;
				}

				state.styles.popper.maxWidth = `${maxWidth}px`;
				state.styles.popper.maxHeight = `${maxHeight}px`;
			},
		},
	] as const satisfies Modifier<string, any>[];
}
