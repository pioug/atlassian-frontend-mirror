import { Mapping, type StepMap } from '@atlaskit/editor-prosemirror/transform';

type StepRange = {
	fromB: number;
	toB: number;
};

// ProseMirror's assoc value chooses which side of an insertion a mapped boundary stays on.
const FROM_ASSOC = -1;
const TO_ASSOC = 1;

/** Maps a step's range into final-document coordinates when the rollout path supplies step maps. */
export const mapStepRangeToFinal = (
	from: number,
	to: number,
	stepIndex: number,
	stepMaps?: StepMap[],
): StepRange | undefined => {
	if (!stepMaps) {
		return { fromB: from, toB: to };
	}

	// The range is already in the document immediately after this step, so skip its own map and
	// apply only the maps from subsequent steps.
	const firstSubsequentStepIndex = stepIndex + 1;
	const finalRange = new Mapping(stepMaps.slice(firstSubsequentStepIndex));
	const fromB = finalRange.mapResult(from, FROM_ASSOC);
	const toB = finalRange.mapResult(to, TO_ASSOC);
	if (fromB.deleted && toB.deleted) {
		return undefined;
	}

	return { fromB: fromB.pos, toB: toB.pos };
};
