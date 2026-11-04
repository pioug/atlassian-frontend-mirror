import { useEffect, useState } from 'react';

import rafSchedule from 'raf-schd';

import { fg } from '@atlaskit/platform-feature-flags/fg';

/**
 * Counts layout changes that can move the target cell without re-rendering the cell options
 * button: the editor container resizing (window resize, side panel, product sidebar) or the table
 * resizing (column scaling). Changing the count re-renders the button so it repositions on its
 * cell. Stays 0 when the gate is off.
 */
export const useCellLayoutVersion = (targetCellRef: Node | undefined): number => {
	const [layoutVersion, setLayoutVersion] = useState(0);

	useEffect(() => {
		if (!fg('platform_editor_sticky_cell_options_position')) {
			return;
		}
		if (!(targetCellRef instanceof HTMLElement)) {
			return;
		}

		const container = targetCellRef.closest('[data-editor-container="true"]');
		const table = targetCellRef.closest('table');
		const bumpLayoutVersion = rafSchedule(() => setLayoutVersion((version) => version + 1));
		let hasReceivedInitialEntries = false;
		const observer = new ResizeObserver(() => {
			// ResizeObserver reports every observed element once on observe(); that is not a move.
			if (!hasReceivedInitialEntries) {
				hasReceivedInitialEntries = true;
				return;
			}
			bumpLayoutVersion();
		});

		if (container) {
			observer.observe(container);
		}
		if (table) {
			observer.observe(table);
		}

		return () => {
			observer.disconnect();
			bumpLayoutVersion.cancel();
		};
	}, [targetCellRef]);

	return layoutVersion;
};
