import type { HeadingSection } from './collapsible-headings-section-model';

const RENDERER_DOCUMENT_SELECTOR = '.ak-renderer-document';
const RENDERER_START_POS_ATTRIBUTE = 'data-renderer-start-pos';
const HEADING_SELECTOR = [1, 2, 3, 4, 5, 6]
	.map((level) => `h${level}[${RENDERER_START_POS_ATTRIBUTE}]`)
	.join(',');

export const COLLAPSED_CONTENT_OWNERS_ATTRIBUTE = 'data-renderer-collapsed-content-owners';

export type OriginalHiddenAttributes = WeakMap<HTMLElement, string | null>;

function getDirectRendererChild(
	rendererDocument: HTMLElement,
	element: HTMLElement,
): HTMLElement | null {
	let currentElement: HTMLElement | null = element;

	while (currentElement && currentElement.parentElement !== rendererDocument) {
		currentElement = currentElement.parentElement;
	}

	return currentElement?.parentElement === rendererDocument ? currentElement : null;
}

function getTopLevelHeadingPositionsByContainer(
	rendererDocument: HTMLElement,
	topLevelHeadingPositions: ReadonlySet<number>,
): Map<HTMLElement, number> {
	const headingPositionsByContainer = new Map<HTMLElement, number>();

	rendererDocument.querySelectorAll<HTMLElement>(HEADING_SELECTOR).forEach((headingElement) => {
		if (headingElement.closest(RENDERER_DOCUMENT_SELECTOR) !== rendererDocument) {
			return;
		}

		const position = Number(headingElement.getAttribute(RENDERER_START_POS_ATTRIBUTE));
		if (!Number.isFinite(position) || !topLevelHeadingPositions.has(position)) {
			return;
		}

		const headingContainer = getDirectRendererChild(rendererDocument, headingElement);
		if (headingContainer) {
			headingPositionsByContainer.set(headingContainer, position);
		}
	});

	return headingPositionsByContainer;
}

function restoreHiddenAttribute(
	element: HTMLElement,
	originalHiddenAttributes: OriginalHiddenAttributes,
): void {
	if (!originalHiddenAttributes.has(element)) {
		return;
	}

	const originalHiddenAttribute = originalHiddenAttributes.get(element);
	if (originalHiddenAttribute === null || originalHiddenAttribute === undefined) {
		element.removeAttribute('hidden');
	} else {
		element.setAttribute('hidden', originalHiddenAttribute);
	}
	originalHiddenAttributes.delete(element);
}

function setCollapsedOwners(
	element: HTMLElement,
	owners: ReadonlySet<number>,
	originalHiddenAttributes: OriginalHiddenAttributes,
): void {
	if (!originalHiddenAttributes.has(element)) {
		originalHiddenAttributes.set(element, element.getAttribute('hidden'));
	}

	element.setAttribute(COLLAPSED_CONTENT_OWNERS_ATTRIBUTE, Array.from(owners).join(','));
	element.setAttribute('hidden', 'until-found');
}

function getDesiredCollapsedContentOwners(
	rendererDocuments: ReadonlyArray<HTMLElement>,
	collapsedHeadings: ReadonlySet<number>,
	sections: ReadonlyArray<HeadingSection>,
): Map<HTMLElement, Set<number>> {
	const desiredOwners = new Map<HTMLElement, Set<number>>();
	if (collapsedHeadings.size === 0) {
		return desiredOwners;
	}

	const topLevelHeadingPositions = new Set(sections.map((section) => section.headingPos));
	const sectionsByHeadingPosition = new Map(
		sections.map((section) => [section.headingPos, section] as const),
	);

	rendererDocuments.forEach((rendererDocument) => {
		// Index headings once, then reconcile every top-level renderer child in DOM order.
		const headingPositionsByContainer = getTopLevelHeadingPositionsByContainer(
			rendererDocument,
			topLevelHeadingPositions,
		);
		let activeCollapsedSections: HeadingSection[] = [];
		const contentElements = Array.from(rendererDocument.children) as HTMLElement[];

		contentElements.forEach((contentElement) => {
			const headingPosition = headingPositionsByContainer.get(contentElement);
			if (headingPosition !== undefined) {
				activeCollapsedSections = activeCollapsedSections.filter(
					(section) => section.to > headingPosition,
				);
			}

			if (activeCollapsedSections.length > 0) {
				desiredOwners.set(
					contentElement,
					new Set(activeCollapsedSections.map((section) => section.headingPos)),
				);
			}

			if (headingPosition !== undefined && collapsedHeadings.has(headingPosition)) {
				const section = sectionsByHeadingPosition.get(headingPosition);
				if (section) {
					activeCollapsedSections.push(section);
				}
			}
		});
	});

	return desiredOwners;
}

/** Returns renderer documents owned by this renderer root, excluding nested renderers. */
export function getOwnedRendererDocuments(rendererRoot: HTMLElement): HTMLElement[] {
	return Array.from(rendererRoot.querySelectorAll<HTMLElement>(RENDERER_DOCUMENT_SELECTOR)).filter(
		(rendererDocument) => {
			const parentRendererDocument = rendererDocument.parentElement?.closest(
				RENDERER_DOCUMENT_SELECTOR,
			);
			return !parentRendererDocument || !rendererRoot.contains(parentRendererDocument);
		},
	);
}

/** Applies only the visibility-attribute differences required by the collapsed section model. */
export function reconcileCollapsedHeadingContent({
	collapsedHeadings,
	originalHiddenAttributes,
	rendererRoot,
	sections,
}: {
	collapsedHeadings: ReadonlySet<number>;
	originalHiddenAttributes: OriginalHiddenAttributes;
	rendererRoot: HTMLElement;
	sections: ReadonlyArray<HeadingSection>;
}): void {
	const rendererDocuments = getOwnedRendererDocuments(rendererRoot);
	const desiredOwners = getDesiredCollapsedContentOwners(
		rendererDocuments,
		collapsedHeadings,
		sections,
	);

	rendererDocuments.forEach((rendererDocument) => {
		rendererDocument
			.querySelectorAll<HTMLElement>(`[${COLLAPSED_CONTENT_OWNERS_ATTRIBUTE}]`)
			.forEach((element) => {
				if (
					element.closest(RENDERER_DOCUMENT_SELECTOR) === rendererDocument &&
					!desiredOwners.has(element)
				) {
					element.removeAttribute(COLLAPSED_CONTENT_OWNERS_ATTRIBUTE);
					restoreHiddenAttribute(element, originalHiddenAttributes);
				}
			});
	});

	desiredOwners.forEach((owners, element) => {
		const desiredOwnersAttribute = Array.from(owners).join(',');
		if (
			element.getAttribute(COLLAPSED_CONTENT_OWNERS_ATTRIBUTE) !== desiredOwnersAttribute ||
			element.getAttribute('hidden') !== 'until-found'
		) {
			setCollapsedOwners(element, owners, originalHiddenAttributes);
		}
	});
}

/** Returns the collapsed heading positions that currently hide an element. */
export function getCollapsedContentOwners(element: HTMLElement): number[] {
	return (element.getAttribute(COLLAPSED_CONTENT_OWNERS_ATTRIBUTE) ?? '')
		.split(',')
		.filter((owner) => owner !== '')
		.map(Number)
		.filter(Number.isFinite);
}
