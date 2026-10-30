import { useEffect, useState } from 'react';

import type { Node } from '@atlaskit/editor-prosemirror/model';

/** Hosts independently schedule each sizing property and return cleanup when scheduled. */
export type ScheduleExtensionHeightRemoval = (
	node: Node,
	remove: () => void,
	property: 'height' | 'minHeight',
) => (() => void) | undefined;

const useHeightExpiry = (
	value: number | string | undefined,
	property: 'height' | 'minHeight',
	node?: Node,
	scheduleRemoval?: ScheduleExtensionHeightRemoval,
): boolean => {
	const [expired, setExpired] = useState(false);
	useEffect(() => {
		setExpired(false);
		if (value === undefined || !node || !scheduleRemoval) return;
		return scheduleRemoval(node, () => setExpired(true), property);
	}, [value, property, node, scheduleRemoval]);
	return expired;
};

type UseNodeHeightOptions = {
	hasViewportSize?: boolean;
	node?: Node;
	nodePresetHeight?: number;
	nodePresetMinHeight?: string;
	scheduleRemoval?: ScheduleExtensionHeightRemoval;
};

export const useNodeHeight = ({
	nodePresetMinHeight,
	nodePresetHeight,
	node,
	scheduleRemoval,
	hasViewportSize = false,
}: UseNodeHeightOptions): {
	hasExpired: boolean;
	presetHeight: number | undefined;
	presetMinHeight: string | undefined;
} => {
	const ignorePresets = hasViewportSize && !!scheduleRemoval;
	const presetMinHeight = ignorePresets ? undefined : nodePresetMinHeight;
	const presetHeight = ignorePresets ? undefined : nodePresetHeight;
	const minHeightExpired = useHeightExpiry(presetMinHeight, 'minHeight', node, scheduleRemoval);
	const heightExpired = useHeightExpiry(presetHeight, 'height', node, scheduleRemoval);
	return {
		presetMinHeight: minHeightExpired ? undefined : presetMinHeight,
		presetHeight: heightExpired ? undefined : presetHeight,
		hasExpired: minHeightExpired || heightExpired,
	};
};
