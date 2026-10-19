import { useCallback } from 'react';

import { useXpcFinalSinkCapture } from './useXpcFinalSinkCapture';
import type { XpcFinalSinkHandoff } from './xpcFinalSinkDepartureCapture';

type RendererSurface = 'renderer' | 'smartLink';

export const useXpcRendererHandoff = (
	surface: RendererSurface = 'renderer',
): ((handoff: XpcFinalSinkHandoff) => void) => {
	const capture = useXpcFinalSinkCapture(surface);

	return useCallback(
		(handoff: XpcFinalSinkHandoff) => capture?.observeRendererHandoff(handoff),
		[capture],
	);
};
