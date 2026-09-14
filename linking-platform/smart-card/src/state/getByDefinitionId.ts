import type { CardStore } from '@atlaskit/linking-common/store';

export const getByDefinitionId = (definitionId: string | undefined, store: CardStore): string[] => {
	const urls = Object.keys(store);
	return urls.filter((url) => {
		const { details } = store[url];
		return details && details.meta.definitionId === definitionId;
	});
};
