import { addHold, getActiveInteraction, tryComplete } from '../interaction-metrics';
import scheduleOnPaint from '../segment/schedule-on-paint';

type DataFetchHoldOptions = {
	label: string;
	name: string;
};

export function startDataFetchHold({
	label,
	name,
}: DataFetchHoldOptions): (() => void) | undefined {
	const interaction = getActiveInteraction();

	if (!interaction || interaction.end !== 0) {
		return;
	}

	const releaseHold = addHold(interaction.id, [{ name: label }], name, false);
	let released = false;

	return () => {
		if (released) {
			return;
		}
		released = true;

		scheduleOnPaint(() => {
			releaseHold();
			tryComplete(interaction.id);
		});
	};
}
