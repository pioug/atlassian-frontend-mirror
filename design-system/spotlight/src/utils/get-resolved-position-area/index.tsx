import type { Placement, PositionArea } from "../../types"

const caretPositionMap: Record<Placement, PositionArea> = {
	'top-start': 'start span-start',
	'top-center': 'block-start',
	'top-end': 'start span-end',
	'left-start': 'span-start start',
	'right-start': 'span-start end',
	'left-end': 'span-end start',
	'right-end': 'span-end end',
	'bottom-start': 'end span-start',
	'bottom-center': 'block-end',
	'bottom-end': 'end span-end',
}

export const getResolvedPositionArea = (placement: Placement, positionArea: PositionArea | 'none' | undefined): PositionArea => {
	if (!positionArea || positionArea === 'none') {
		return caretPositionMap[placement]
	}

	return positionArea
}
