import type { InteractionType } from '../common';
import { addHold, getActiveInteraction, tryComplete } from '../interaction-metrics';
import scheduleOnPaint from '../segment/schedule-on-paint';

type DataFetchHoldOptions = {
	label: string;
	name: string;
	/** Holds only interactions of these types. Holds every type when omitted. */
	interactionTypes?: ReadonlyArray<InteractionType>;
};

export function startDataFetchHold({
	label,
	name,
	interactionTypes,
}: DataFetchHoldOptions): (() => void) | undefined {
	const interaction = getActiveInteraction();

	if (!interaction || interaction.end !== 0) {
		return;
	}

	if (interactionTypes && !interactionTypes.includes(interaction.type)) {
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
