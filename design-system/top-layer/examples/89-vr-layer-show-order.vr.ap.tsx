import React, { type ReactNode } from 'react';

import { LayerTree, scenarios, type TScenario } from './170-testing-layer-show-order';

/**
 * Layers that mount open in the same commit. Each one is smaller than its parent and centered, so
 * all of them show only when every layer is above its parent. A covered layer is a visible change.
 *
 * These test the show order, a defensive fix for React's effect order. They are not a pattern to
 * copy: do not design nested layers to open in the same commit.
 */
function Scenario({ name }: { name: TScenario }): ReactNode {
	return <LayerTree kinds={scenarios[name]} isOpen />;
}

export default function VrLayerShowOrderDialogDialog(): ReactNode {
	return <Scenario name="dialog-dialog" />;
}

export function VrLayerShowOrderDialogPopover(): ReactNode {
	return <Scenario name="dialog-popover" />;
}

export function VrLayerShowOrderPopoverPopover(): ReactNode {
	return <Scenario name="popover-popover" />;
}

export function VrLayerShowOrderPopoverDialog(): ReactNode {
	return <Scenario name="popover-dialog" />;
}

export function VrLayerShowOrderDialogPopoverDialog(): ReactNode {
	return <Scenario name="dialog-popover-dialog" />;
}

export function VrLayerShowOrderPopoverDialogPopover(): ReactNode {
	return <Scenario name="popover-dialog-popover" />;
}
