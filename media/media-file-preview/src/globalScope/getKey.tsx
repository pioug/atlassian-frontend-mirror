import { type FileIdentifier } from '@atlaskit/media-client';

const dashed = (param?: string) => (param ? `-${param}` : '');

export const getKey: any = (
	{ id, collectionName, occurrenceKey }: FileIdentifier,
	resizeMode?: string,
) => `${id}${dashed(collectionName)}${dashed(occurrenceKey)}${dashed(resizeMode)}`;
