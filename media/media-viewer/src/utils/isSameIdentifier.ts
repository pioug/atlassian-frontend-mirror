import { type Identifier, isFileIdentifier } from '@atlaskit/media-client';

export const isSameIdentifier = (id1: Identifier, id2: Identifier): boolean => {
	if (isFileIdentifier(id1) && isFileIdentifier(id2)) {
		return id1.id === id2.id;
	}
	if (!isFileIdentifier(id1) && !isFileIdentifier(id2)) {
		return id1.dataURI === id2.dataURI;
	}
	return false;
};
