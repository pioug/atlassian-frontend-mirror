import type { ArrayOfRows } from './array-of-rows';

export const moveRowInArrayOfRows = (
	arrayOfNodes: ArrayOfRows,
	indexesOrigin: number[],
	indexesTarget: number[],
	directionOverride: number,
): ArrayOfRows => {
	const direction = indexesOrigin[0] > indexesTarget[0] ? -1 : 1;

	const rowsExtracted = arrayOfNodes.splice(indexesOrigin[0], indexesOrigin.length);
	const positionOffset = rowsExtracted.length % 2 === 0 ? 1 : 0;
	let target;

	if (directionOverride === -1 && direction === 1) {
		target = indexesTarget[0] - 1;
	} else if (directionOverride === 1 && direction === -1) {
		target = indexesTarget[indexesTarget.length - 1] - positionOffset + 1;
	} else {
		target =
			direction === -1
				? indexesTarget[0]
				: indexesTarget[indexesTarget.length - 1] - positionOffset;
	}

	// @ts-ignore no idea what this line does
	arrayOfNodes.splice.apply(arrayOfNodes, [target, 0].concat(rowsExtracted));

	return arrayOfNodes;
};
