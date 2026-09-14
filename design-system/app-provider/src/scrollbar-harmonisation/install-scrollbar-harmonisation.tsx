import { SCROLLBAR_HARMONISATION_ATTRIBUTE } from './constants';
import { type Controller, installDocumentAttribute } from './install-document-attribute';

const controllers = new WeakMap<Document, Controller>();

/**
 * Enables the harmonised scrollbar appearance for one document.
 *
 * Repeated installation is reference counted so separate React roots do not
 * disable the appearance while another root still uses it.
 */
export function installScrollbarHarmonisation(targetDocument: Document): () => void {
	return installDocumentAttribute(targetDocument, SCROLLBAR_HARMONISATION_ATTRIBUTE, controllers);
}
