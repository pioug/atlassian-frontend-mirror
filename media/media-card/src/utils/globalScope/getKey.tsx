import { type FileIdentifier } from '@atlaskit/media-client';

const dashed = (param?: string) => (param ? `-${param}` : '');

export const getKey = ({ id, collectionName, occurrenceKey }: FileIdentifier): string =>
	`${id}${dashed(collectionName)}${dashed(occurrenceKey)}`;
