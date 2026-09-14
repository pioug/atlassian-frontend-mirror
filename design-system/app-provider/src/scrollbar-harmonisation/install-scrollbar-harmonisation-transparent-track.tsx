import { SCROLLBAR_HARMONISATION_TRANSPARENT_ATTRIBUTE } from './constants';
import { type Controller, installDocumentAttribute } from './install-document-attribute';

const controllers = new WeakMap<Document, Controller>();

export function installScrollbarHarmonisationTransparentTrack(
	targetDocument: Document,
): () => void {
	return installDocumentAttribute(
		targetDocument,
		SCROLLBAR_HARMONISATION_TRANSPARENT_ATTRIBUTE,
		controllers,
	);
}
