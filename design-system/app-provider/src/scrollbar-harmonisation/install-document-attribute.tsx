export interface Controller {
	references: number;
	release: () => void;
}

/**
 * Enables a document attribute with reference-counted cleanup.
 */
export function installDocumentAttribute(
	targetDocument: Document,
	attribute: string,
	controllers: WeakMap<Document, Controller>,
): () => void {
	const existingController = controllers.get(targetDocument);

	if (existingController) {
		existingController.references += 1;
		let isReleased = false;

		return () => {
			if (isReleased) {
				return;
			}

			isReleased = true;
			existingController.references -= 1;

			if (existingController.references === 0) {
				existingController.release();
				controllers.delete(targetDocument);
			}
		};
	}

	const rootElement = targetDocument.documentElement;
	const controller: Controller = {
		references: 1,
		release: () => rootElement.removeAttribute(attribute),
	};

	rootElement.setAttribute(attribute, '');
	controllers.set(targetDocument, controller);

	let isReleased = false;
	return () => {
		if (isReleased) {
			return;
		}

		isReleased = true;
		controller.references -= 1;

		if (controller.references === 0) {
			controller.release();
			controllers.delete(targetDocument);
		}
	};
}
