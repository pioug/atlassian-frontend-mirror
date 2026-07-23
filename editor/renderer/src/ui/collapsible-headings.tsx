import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { bind } from 'bind-event-listener';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import {
	COLLAPSED_CONTENT_OWNERS_ATTRIBUTE,
	getCollapsedContentOwners,
	getOwnedRendererDocuments,
	reconcileCollapsedHeadingContent,
} from './collapsible-headings-dom';
import { buildTopLevelHeadingSections } from './collapsible-headings-section-model';

export type CollapsibleHeadingsController = {
	canCollapse: (headingPos: number) => boolean;
	collapse: (headingPos: number) => void;
	expand: (headingPos: number) => void;
	expandContainingPosition: (position: number) => void;
	expandMany: (headingPositions: Iterable<number>) => void;
	isCollapsed: (headingPos: number) => boolean;
	toggle: (headingPos: number) => void;
};

export type CollapsibleHeading = {
	isCollapsed: boolean;
	toggle: () => void;
};

const CollapsibleHeadingsContext = React.createContext<CollapsibleHeadingsController | null>(null);
const emptyCollapsedHeadings = new Set<number>();

function supportsHiddenUntilFound(rendererRef: React.RefObject<HTMLDivElement>): boolean {
	const body = rendererRef.current?.ownerDocument.body;
	return body ? 'onbeforematch' in body : false;
}

/** Provides collapse state and synchronizes hidden top-level renderer content. */
export function CollapsibleHeadingsProvider({
	children,
	isEnabled,
	pmDocument,
	rendererRef,
}: {
	children: React.ReactNode;
	isEnabled: boolean;
	pmDocument?: PMNode;
	rendererRef: React.RefObject<HTMLDivElement>;
}): React.JSX.Element {
	const [isBrowserFindSupported, setIsBrowserFindSupported] = useState(false);
	const [state, setState] = useState<{
		pmDocument?: PMNode;
		positions: Set<number>;
	}>({ pmDocument, positions: new Set() });
	const originalHiddenAttributes = React.useRef(new WeakMap<HTMLElement, string | null>()).current;
	const sections = useMemo(() => buildTopLevelHeadingSections(pmDocument), [pmDocument]);
	const collapsibleSectionPositions = useMemo(
		() =>
			new Set(
				sections
					.filter((section) => section.contentFrom < section.to)
					.map((section) => section.headingPos),
			),
		[sections],
	);
	const collapsedHeadings =
		state.pmDocument === pmDocument ? state.positions : emptyCollapsedHeadings;
	const isActive = isEnabled && isBrowserFindSupported && Boolean(pmDocument);

	useEffect(() => {
		setIsBrowserFindSupported(isEnabled && supportsHiddenUntilFound(rendererRef));
	}, [isEnabled, rendererRef]);

	const updateCollapsedHeadings = useCallback(
		(update: (positions: Set<number>) => boolean) => {
			setState((currentState) => {
				const positions = new Set(
					currentState.pmDocument === pmDocument ? currentState.positions : emptyCollapsedHeadings,
				);
				if (!update(positions)) {
					return currentState.pmDocument === pmDocument ? currentState : { pmDocument, positions };
				}
				return { pmDocument, positions };
			});
		},
		[pmDocument],
	);

	const collapse = useCallback(
		(headingPos: number) => {
			if (!collapsibleSectionPositions.has(headingPos)) {
				return;
			}
			updateCollapsedHeadings((positions) => {
				if (positions.has(headingPos)) {
					return false;
				}
				positions.add(headingPos);
				return true;
			});
		},
		[collapsibleSectionPositions, updateCollapsedHeadings],
	);

	const expand = useCallback(
		(headingPos: number) => {
			updateCollapsedHeadings((positions) => positions.delete(headingPos));
		},
		[updateCollapsedHeadings],
	);

	const expandMany = useCallback(
		(headingPositions: Iterable<number>) => {
			const positionsToExpand = new Set(headingPositions);
			updateCollapsedHeadings((positions) => {
				let didChange = false;
				positionsToExpand.forEach((headingPos) => {
					didChange = positions.delete(headingPos) || didChange;
				});
				return didChange;
			});
		},
		[updateCollapsedHeadings],
	);

	const expandContainingPosition = useCallback(
		(position: number) => {
			expandMany(
				sections
					.filter((section) => position >= section.contentFrom && position < section.to)
					.map((section) => section.headingPos),
			);
		},
		[expandMany, sections],
	);

	const toggle = useCallback(
		(headingPos: number) => {
			if (!collapsibleSectionPositions.has(headingPos)) {
				return;
			}
			updateCollapsedHeadings((positions) => {
				if (positions.has(headingPos)) {
					positions.delete(headingPos);
				} else {
					positions.add(headingPos);
				}
				return true;
			});
		},
		[collapsibleSectionPositions, updateCollapsedHeadings],
	);

	const contextValue = useMemo<CollapsibleHeadingsController | null>(
		() =>
			isActive
				? {
						canCollapse: (headingPos) => collapsibleSectionPositions.has(headingPos),
						collapse,
						expand,
						expandContainingPosition,
						expandMany,
						isCollapsed: (headingPos) => collapsedHeadings.has(headingPos),
						toggle,
					}
				: null,
		[
			collapse,
			collapsedHeadings,
			collapsibleSectionPositions,
			expand,
			expandContainingPosition,
			expandMany,
			isActive,
			toggle,
		],
	);

	useEffect(() => {
		const rendererRoot = rendererRef.current;
		if (!rendererRoot) {
			return;
		}

		const positions = isActive ? collapsedHeadings : emptyCollapsedHeadings;
		const sync = () =>
			reconcileCollapsedHeadingContent({
				collapsedHeadings: positions,
				originalHiddenAttributes,
				rendererRoot,
				sections,
			});
		sync();

		if (!isActive || positions.size === 0) {
			return;
		}

		const rendererDocuments = getOwnedRendererDocuments(rendererRoot);
		const rendererDocumentSet = new Set(rendererDocuments);
		const handleBeforeMatch = (event: Event) => {
			const target = event.target;
			const HTMLElementConstructor = rendererRoot.ownerDocument.defaultView?.HTMLElement;
			if (!HTMLElementConstructor || !(target instanceof HTMLElementConstructor)) {
				return;
			}

			const collapsedContent = target.closest<HTMLElement>(
				`[${COLLAPSED_CONTENT_OWNERS_ATTRIBUTE}]`,
			);
			if (!collapsedContent) {
				return;
			}
			const rendererDocument = collapsedContent.closest<HTMLElement>('.ak-renderer-document');
			if (!rendererDocument || !rendererDocumentSet.has(rendererDocument)) {
				return;
			}
			expandMany(getCollapsedContentOwners(collapsedContent));
		};

		const unbindBeforeMatchListeners = rendererDocuments.map((rendererDocument) =>
			bind(rendererDocument, {
				type: 'beforematch',
				listener: handleBeforeMatch,
				options: { capture: true },
			}),
		);

		const observer =
			typeof MutationObserver === 'undefined' ? undefined : new MutationObserver(sync);
		rendererDocuments.forEach((rendererDocument) => {
			observer?.observe(rendererDocument, { childList: true });
		});

		return () => {
			observer?.disconnect();
			unbindBeforeMatchListeners.forEach((unbindBeforeMatch) => unbindBeforeMatch());
		};
	}, [collapsedHeadings, expandMany, isActive, originalHiddenAttributes, rendererRef, sections]);

	useEffect(
		() => () => {
			const rendererRoot = rendererRef.current;
			if (rendererRoot) {
				reconcileCollapsedHeadingContent({
					collapsedHeadings: emptyCollapsedHeadings,
					originalHiddenAttributes,
					rendererRoot,
					sections: [],
				});
			}
		},
		[originalHiddenAttributes, rendererRef],
	);

	return (
		<CollapsibleHeadingsContext.Provider value={contextValue}>
			{children}
		</CollapsibleHeadingsContext.Provider>
	);
}

/** Returns collapse state for a top-level heading when the provider is enabled. */
export function useCollapsibleHeading(
	startPos: number,
	isTopLevel: boolean,
): CollapsibleHeading | null {
	const context = React.useContext(CollapsibleHeadingsContext);
	const contextToggle = context?.toggle;
	const isCollapsible = Boolean(context && isTopLevel && context.canCollapse(startPos));
	const isCollapsed = Boolean(isCollapsible && context?.isCollapsed(startPos));
	const toggle = useCallback(() => contextToggle?.(startPos), [contextToggle, startPos]);

	return useMemo(
		() => (isCollapsible ? { isCollapsed, toggle } : null),
		[isCollapsed, isCollapsible, toggle],
	);
}

/** Returns the collapse controller for integrations such as renderer Find. */
export function useCollapsibleHeadingsController(): CollapsibleHeadingsController | null {
	return React.useContext(CollapsibleHeadingsContext);
}
