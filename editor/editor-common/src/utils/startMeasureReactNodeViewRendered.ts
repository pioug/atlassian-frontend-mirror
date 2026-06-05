import { startMeasure } from '../performance-measures';

export function startMeasureReactNodeViewRendered({
	nodeTypeName,
}: {
	nodeTypeName: string;
}): void {
	startMeasure(`🦉${nodeTypeName}::ReactNodeView`);
}
