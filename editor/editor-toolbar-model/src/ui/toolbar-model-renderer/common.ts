import type { RegisterComponent, RegisterToolbarSection } from '../../types';

export const getSortedChildren = <T extends { parents: Array<{ key: string; rank: number }> }>(
	components: T[],
	parentKey: string,
): T[] =>
	components
		.filter((component) => component.parents.some((parent) => parent.key === parentKey))
		.sort(
			(a, b) =>
				(a.parents.find((p) => p.key === parentKey)?.rank || 0) -
				(b.parents.find((p) => p.key === parentKey)?.rank || 0),
		);

export const NoOp = <T extends Record<string, unknown> = Record<string, unknown>>(
	props: T,
): React.ReactNode => null;

export const isSection = (component: RegisterComponent): component is RegisterToolbarSection => {
	return component.type === 'section';
};
