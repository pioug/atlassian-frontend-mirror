/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { css } from '@compiled/react';
import { useIntl } from 'react-intl';

import AnalyticsContext from '@atlaskit/analytics-next/AnalyticsContext';
import IconButton from '@atlaskit/button/icon/button';
import { jsx } from '@atlaskit/css';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics/api';
// eslint-disable-next-line @atlaskit/platform/no-barrel-entry-imports
import { messages } from '@atlaskit/editor-common/quick-insert';
import type { QuickInsertSelectionHandler } from '@atlaskit/editor-common/quick-insert/context';
import { MENU, RECOMMENDED_SECTION } from '@atlaskit/editor-common/quick-insert/keys';
import type { RegisteredItemRankResolver } from '@atlaskit/editor-common/registered-menu/item-rank';
import { createRegisteredMenuSurfaceContext } from '@atlaskit/editor-common/registered-menu/surface-context';
import { getMenuFooterSectionKey } from '@atlaskit/editor-common/type-ahead-get-menu-footer-section-key';
import { getSectionOverflowItemKey } from '@atlaskit/editor-common/type-ahead-get-section-overflow-item-key';
import type { EmptyStateHandler } from '@atlaskit/editor-common/types/empty-state-handler';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { RegisterComponent, RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';
import CrossIcon from '@atlaskit/icon/core/cross';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import Textfield from '@atlaskit/textfield/text-field';
import { token } from '@atlaskit/tokens';

import type { RecommendedItemsResolver } from '../registered-menu/get-quick-insert-menu-model';
import { useQuickInsertSearchAnalytics } from '../registered-menu/useQuickInsertSearchAnalytics';
import {
	RETURN_TO_SEARCH,
	type RegistryElementBrowserArrowKey,
} from './getVirtualizedArrowKeyTarget';
import {
	createRegistryElementBrowserModel,
	getInitialRegistryElementBrowserSection,
} from './model';
import { getOptions } from './options';
import { RegistryElementBrowserCategories } from './RegistryElementBrowserCategories';
import { RegistryElementBrowserFooter } from './RegistryElementBrowserFooter';
import { RegistryElementBrowserSearchResults } from './RegistryElementBrowserSearchResults';
import { useVirtualizedGridNavigation } from './useVirtualizedGridNavigation';

type Props = {
	components: RegisterComponent[];
	defaultSection?: string;
	editorView: EditorView;
	emptyStateHandler?: EmptyStateHandler;
	fireAnalyticsEvent?: EditorAnalyticsAPI['fireAnalyticsEvent'];
	getItemRank?: RegisteredItemRankResolver;
	getRecommendedItems?: RecommendedItemsResolver;
	helpUrl?: string;
	isLoading?: boolean;
	isOffline: boolean;
	isOpen: boolean;
	onClearSelection: () => void;
	onClose: () => void;
	onCloseComplete: () => void;
	onConfirmInsert: () => void;
	onSelect: (handler: QuickInsertSelectionHandler) => void;
};

type BrowserState = {
	invalidation?: { section?: string; selection: boolean };
	query: string;
	section?: string;
	selectedRegistration?: RegisterMenuItem;
	selectionIsOffline?: boolean;
};

const browserGridTemplateColumns = '182px minmax(0, 1fr)';
const categoryColumnGap = `calc(${token('space.200')} + ${token('space.150')})`;
// Keep tiles at least 215px wide within the modal, including room for its scrollbar.
const mediumGridQuery = '(min-width: 613px)';
const wideGridQuery = '(min-width: 1054px)';

const browserLayoutStyles = css({
	display: 'grid',
	gap: categoryColumnGap,
	gridTemplateColumns: browserGridTemplateColumns,
	paddingBlockStart: token('space.050'),
	paddingInline: token('space.200'),
	// Narrow modal: categories stack above the results instead of sitting beside them.
	'@media (max-width: 822px)': {
		gridTemplateColumns: 'minmax(0, 1fr)',
		rowGap: token('space.150'),
	},
});

// The modal header keeps its 24px inline padding, so a narrower gap lines the search field up
// with the results below (16px body padding + 182px + 28px gap).
const headerContentStyles = css({
	display: 'grid',
	gap: token('space.250'),
	gridTemplateColumns: browserGridTemplateColumns,
	width: '100%',
	// Narrow modal: the search field spans the full width, matching the stacked categories.
	'@media (max-width: 822px)': {
		gridTemplateColumns: 'minmax(0, 1fr)',
	},
});

const headerSearchStyles = css({
	alignItems: 'center',
	display: 'grid',
	gap: token('space.300'),
	gridTemplateColumns: 'minmax(0, 1fr) auto',
	width: '100%',
});

const resultsId = 'registry-element-browser-results';
const modalTestId = 'registry-element-browser-modal';

const arrowKeys = new Set<string>(['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp']);
const isArrowKey = (key: string): key is RegistryElementBrowserArrowKey => arrowKeys.has(key);

const getOptionKey = (element: Element): string | undefined => {
	const option = element.closest<HTMLElement>('[role="option"]');
	return option?.closest<HTMLElement>('[data-virtual-option]')?.dataset.virtualOption || option?.id;
};

// Gives the ADS events inside the browser (search and categories, not the footer) the element
// browser's source hierarchy.
const SOURCE_ANALYTICS_CONTEXT = { source: 'ElementBrowser' };
const ElementBrowserAnalyticsContext = ({
	children,
}: {
	children: React.ReactNode;
}): React.JSX.Element =>
	fg('platform_editor_slash_command_analytics') ? (
		<AnalyticsContext data={SOURCE_ANALYTICS_CONTEXT}>{children}</AnalyticsContext>
	) : (
		<React.Fragment>{children}</React.Fragment>
	);

export const RegistryElementBrowser = ({
	components,
	emptyStateHandler,
	fireAnalyticsEvent,
	defaultSection,
	getItemRank,
	getRecommendedItems,
	helpUrl,
	editorView,
	isLoading = false,
	isOffline,
	isOpen,
	onClearSelection,
	onClose,
	onCloseComplete,
	onConfirmInsert,
	onSelect,
}: Props): React.JSX.Element | null => {
	const { formatMessage } = useIntl();
	const [session, setSession] = useState(() => ({ isOpen, menuOpenId: Symbol('element-browser') }));
	if (session.isOpen !== isOpen) {
		setSession({
			isOpen,
			menuOpenId: isOpen ? Symbol('element-browser') : session.menuOpenId,
		});
	}
	const surfaceContext = useMemo(
		() =>
			createRegisteredMenuSurfaceContext({
				menuOpenId: session.menuOpenId,
				surface: 'element-browser',
			}),
		[session.menuOpenId],
	);
	const [browserState, setBrowserState] = useState<BrowserState>({
		query: '',
		section: defaultSection,
	});
	const { query, section, selectedRegistration } = browserState;
	const selectedRegistrationRef = useRef<RegisterMenuItem | undefined>(undefined);
	// Recommendations depend only on the registry, so typing a query does not re-run the resolver.
	const recommendedRegistrations = useMemo(
		() => getRecommendedItems?.({ components, surfaceContext }),
		[components, getRecommendedItems, surfaceContext],
	);
	const model = useMemo(() => {
		return createRegistryElementBrowserModel(components, {
			footerKey: getMenuFooterSectionKey(MENU.key),
			formatMessage,
			getItemRank,
			query,
			section,
			surfaceContext,
			overflowKeys: new Set(
				components
					.filter((component) => component.type === 'menu-section')
					.map((component) => getSectionOverflowItemKey(component.key)),
			),
			recommendedRegistrations,
			recommendedSectionKey: RECOMMENDED_SECTION.key,
			rootKey: MENU.key,
		});
	}, [
		components,
		formatMessage,
		getItemRank,
		query,
		recommendedRegistrations,
		section,
		surfaceContext,
	]);
	const { effectiveSection, items, recommendedItems } = model;
	const matchCount = recommendedItems.length + items.length;
	const shouldRenderEmptyState = matchCount === 0 && !isLoading;
	const regularItems =
		shouldRenderEmptyState && query.trim() ? (model.fallbackItems ?? items) : items;
	const visibleItems = useMemo(
		() => [...recommendedItems, ...regularItems],
		[recommendedItems, regularItems],
	);
	const isSelectedRegistrationCurrent = Boolean(
		selectedRegistration &&
		browserState.selectionIsOffline === isOffline &&
		visibleItems.some(({ registration }) => registration === selectedRegistration),
	);
	const selectedKey = isSelectedRegistrationCurrent ? selectedRegistration?.key : undefined;
	const invalidSection = Boolean(section && section !== effectiveSection);
	const invalidSelection = Boolean(selectedRegistration && !isSelectedRegistrationCurrent);
	if (isOpen && (invalidSection || invalidSelection)) {
		setBrowserState({
			...browserState,
			section: effectiveSection,
			selectedRegistration: undefined,
			selectionIsOffline: undefined,
			invalidation: { section: invalidSection ? section : undefined, selection: invalidSelection },
		});
	}
	const searchInputRef = useRef<HTMLInputElement>(null);
	const resultsRef = useRef<HTMLDivElement>(null);
	const selectedCategoryRef = useRef<HTMLButtonElement>(null);
	const focusedCategoryRef = useRef<string | undefined>();
	const handledInvalidationRef = useRef(browserState.invalidation);
	const wasOpen = useRef(false);
	const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);
	const [columnCount, setColumnCount] = useState(1);
	const previousColumnCount = useRef(columnCount);
	const { cancelNavigation, navigate, requestedRow } = useVirtualizedGridNavigation();
	const [focusedKey, setFocusedKey] = useState<string>();
	const rowCount = Math.ceil(regularItems.length / columnCount);
	const focusedIndex =
		focusedKey === undefined
			? -1
			: regularItems.findIndex(({ registration }) => registration.key === focusedKey);
	const focusedRow = focusedIndex < 0 ? undefined : Math.floor(focusedIndex / columnCount);
	const setBrowserLayoutRef = useCallback((element: HTMLDivElement | null) => {
		setScrollElement(
			element?.closest<HTMLElement>(`[data-testid="${modalTestId}--scrollable"]`) ?? null,
		);
	}, []);

	useLayoutEffect(() => {
		const ownerWindow = scrollElement?.ownerDocument.defaultView;
		if (!ownerWindow?.matchMedia) {
			return;
		}
		const medium = ownerWindow.matchMedia(mediumGridQuery);
		const wide = ownerWindow.matchMedia(wideGridQuery);
		const updateColumnCount = () => setColumnCount(wide.matches ? 3 : medium.matches ? 2 : 1);
		updateColumnCount();
		medium.onchange = updateColumnCount;
		wide.onchange = updateColumnCount;
		return () => {
			medium.onchange = null;
			wide.onchange = null;
		};
	}, [scrollElement]);

	useLayoutEffect(() => {
		cancelNavigation();
	}, [cancelNavigation, columnCount, isOpen, visibleItems]);

	useLayoutEffect(() => {
		const columnsChanged = previousColumnCount.current !== columnCount;
		previousColumnCount.current = columnCount;
		const results = resultsRef.current;
		const ownerDocument = results?.ownerDocument;
		const activeElement = ownerDocument?.activeElement;
		if (!isOpen || !focusedKey || (!columnsChanged && activeElement !== ownerDocument?.body)) {
			return;
		}
		const option = getOptions(results).find((option) => getOptionKey(option) === focusedKey);
		if (activeElement === ownerDocument?.body) {
			// Changing columns or registrations can move the focused tile to a different row.
			option?.focus({ preventScroll: columnsChanged });
		}
		const ownerWindow = ownerDocument?.defaultView;
		if (!columnsChanged || !option || !ownerWindow) {
			return;
		}
		const scrollFocusedOptionIntoView = () => {
			if (ownerDocument.activeElement === option) {
				option.scrollIntoView({ block: 'nearest', inline: 'nearest' });
			}
		};
		// Media queries change before resize observers remeasure the grid in the same frame.
		let frame = ownerWindow.requestAnimationFrame(() => {
			frame = ownerWindow.requestAnimationFrame(scrollFocusedOptionIntoView);
		});
		return () => ownerWindow.cancelAnimationFrame(frame);
	}, [columnCount, focusedKey, isOpen, visibleItems]);

	const resetResultsScroll = useCallback(() => {
		if (scrollElement) {
			scrollElement.scrollTop = 0;
		}
		cancelNavigation();
		setFocusedKey(undefined);
	}, [cancelNavigation, scrollElement]);

	useEffect(() => {
		if (isOpen && !wasOpen.current) {
			selectedRegistrationRef.current = undefined;
			setBrowserState({
				query: '',
				section: getInitialRegistryElementBrowserSection(model.sections, defaultSection),
				selectedRegistration: undefined,
			});
			onClearSelection();
		}
		wasOpen.current = isOpen;
	}, [defaultSection, isOpen, model, onClearSelection]);
	useEffect(() => {
		const invalidation = browserState.invalidation;
		if (!isOpen || !invalidation || handledInvalidationRef.current === invalidation) {
			return;
		}
		handledInvalidationRef.current = invalidation;
		selectedRegistrationRef.current = undefined;
		onClearSelection();
		const ownerDocument = searchInputRef.current?.ownerDocument;
		const activeElement = ownerDocument?.activeElement;
		if (
			invalidation.section &&
			focusedCategoryRef.current === invalidation.section &&
			activeElement === ownerDocument?.body
		) {
			selectedCategoryRef.current?.focus();
		} else if (
			invalidation.selection &&
			(activeElement === ownerDocument?.body || activeElement?.closest('[role="option"]'))
		) {
			searchInputRef.current?.focus();
		}
	}, [browserState.invalidation, isOpen, onClearSelection]);

	const flushSearchAnalytics = useQuickInsertSearchAnalytics({
		query,
		resultCount: matchCount,
		surface: 'element-browser',
		category: effectiveSection ?? 'all',
		isOpen: isOpen && !isLoading,
		fireAnalyticsEvent,
	});
	const closeBrowser = useCallback(() => {
		flushSearchAnalytics();
		onClose();
	}, [flushSearchAnalytics, onClose]);

	const onSearchFocus = useCallback(() => {
		focusedCategoryRef.current = undefined;
	}, []);
	const onBrowserFocusCapture = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
		const categories = event.currentTarget.querySelector(
			'[data-testid="registry-element-browser-categories"]',
		);
		const category =
			event.target instanceof HTMLElement && categories?.contains(event.target)
				? event.target.closest<HTMLElement>('[data-section]')
				: null;
		focusedCategoryRef.current = category ? (category.dataset.section ?? '') : undefined;
	}, []);

	const onSearchChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const nextQuery = event.currentTarget.value;
			resetResultsScroll();
			selectedRegistrationRef.current = undefined;
			setBrowserState((current) => ({
				...current,
				query: nextQuery,
				selectedRegistration: undefined,
			}));
			onClearSelection();
		},
		[onClearSelection, resetResultsScroll],
	);
	const onSectionClick = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			const nextSection = event.currentTarget.dataset.section || undefined;
			resetResultsScroll();
			selectedRegistrationRef.current = undefined;
			setBrowserState({
				query: '',
				section: nextSection,
				selectedRegistration: undefined,
			});
			onClearSelection();
		},
		[onClearSelection, resetResultsScroll],
	);
	const onRegistrySelect = useCallback(
		(registration: RegisterMenuItem, handler: QuickInsertSelectionHandler) => {
			selectedRegistrationRef.current = registration;
			setBrowserState((current) => ({
				...current,
				selectedRegistration: registration,
				selectionIsOffline: isOffline,
			}));
			onSelect(handler);
		},
		[isOffline, onSelect],
	);
	const confirmInsert = useCallback(() => {
		const selectedRegistration = selectedRegistrationRef.current;
		if (
			!selectedRegistration ||
			!visibleItems.some(({ registration }) => registration === selectedRegistration)
		) {
			return;
		}
		onConfirmInsert();
	}, [onConfirmInsert, visibleItems]);
	const onModalOpenComplete = useCallback((node: HTMLElement) => {
		node.style.borderRadius = token('radius.large', '8px');
		const footer = node.querySelector<HTMLElement>(`[data-testid="${modalTestId}--footer"]`);
		footer?.style.setProperty('box-sizing', 'border-box');
		footer?.style.setProperty('height', '64px');
		footer?.style.setProperty('padding-block', token('space.200'));

		const scrollableBody = node.querySelector<HTMLElement>(
			`[data-testid="${modalTestId}--scrollable"]`,
		);
		scrollableBody?.style.setProperty('border-block-start', 'none');
		scrollableBody?.style.setProperty('border-block-end', 'none');
	}, []);
	const navigateResults = useCallback(
		(
			currentOption: HTMLElement | null,
			key: RegistryElementBrowserArrowKey,
			onTarget: (target: HTMLElement | typeof RETURN_TO_SEARCH | undefined) => boolean,
			repeat?: boolean,
		) => {
			const container = resultsRef.current;
			return container
				? navigate({ container, currentOption, key, rowCount }, onTarget, repeat)
				: false;
		},
		[navigate, rowCount],
	);
	const onResultsFocus = useCallback(
		(event: React.FocusEvent<HTMLDivElement>) => {
			if (event.target === event.currentTarget) {
				navigateResults(null, 'ArrowDown', (target) => {
					if (!target || target === RETURN_TO_SEARCH) {
						return false;
					}
					target.focus();
					return true;
				});
				return;
			}
			setFocusedKey(getOptionKey(event.target));
		},
		[navigateResults],
	);
	const onResultsBlur = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
		if (event.relatedTarget) {
			setFocusedKey(
				event.relatedTarget instanceof Element ? getOptionKey(event.relatedTarget) : undefined,
			);
		}
	}, []);
	const onKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (
				event.key === 'Tab' &&
				event.shiftKey &&
				event.target instanceof HTMLElement &&
				event.target.getAttribute('role') === 'option'
			) {
				event.preventDefault();
				selectedCategoryRef.current?.focus();
				return;
			}

			if (isArrowKey(event.key)) {
				if (
					event.currentTarget === searchInputRef.current &&
					(event.key === 'ArrowLeft' || event.key === 'ArrowRight')
				) {
					return;
				}

				const currentOption =
					event.target instanceof HTMLElement
						? event.target.closest<HTMLElement>('[role="option"]')
						: null;
				const handled = navigateResults(
					currentOption,
					event.key,
					(target) => {
						if (target === RETURN_TO_SEARCH) {
							searchInputRef.current?.focus();
							return true;
						}
						if (!target) {
							return false;
						}
						target.focus();
						target.click();
						return true;
					},
					event.repeat,
				);
				if (handled) {
					event.preventDefault();
				}
				return;
			}

			// On the top-layer path, the modal closes on Escape through `onClose`, after any open layer
			// above it.
			if (!fg('platform-dst-top-layer') && event.key === 'Escape') {
				event.preventDefault();
				cancelNavigation();
				closeBrowser();
				return;
			}

			if (event.key === 'Enter') {
				const focusedOption =
					event.target instanceof HTMLElement
						? event.target.closest<HTMLElement>('[role="option"]')
						: null;
				if (isSelectedRegistrationCurrent || focusedOption) {
					event.preventDefault();
					cancelNavigation();
					if (!isSelectedRegistrationCurrent) {
						focusedOption?.click();
					}
					confirmInsert();
					return;
				}
				const handled = navigateResults(null, 'ArrowDown', (target) => {
					if (!target || target === RETURN_TO_SEARCH) {
						return false;
					}
					target.click();
					confirmInsert();
					return true;
				});
				if (handled) {
					event.preventDefault();
				}
			}
		},
		[cancelNavigation, closeBrowser, confirmInsert, isSelectedRegistrationCurrent, navigateResults],
	);

	return (
		<ModalTransition>
			{isOpen && (
				<Modal
					label={formatMessage(messages.elementBrowserTitle)}
					height="804px"
					onClose={closeBrowser}
					onCloseComplete={onCloseComplete}
					onOpenComplete={onModalOpenComplete}
					testId={modalTestId}
					width="min(1072px, calc(100vw - 32px))"
				>
					<ElementBrowserAnalyticsContext>
						<ModalHeader>
							<div css={headerContentStyles}>
								<ModalTitle>{formatMessage(messages.elementBrowserTitle)}</ModalTitle>
								<div css={headerSearchStyles}>
									<Textfield
										autoFocus
										aria-controls={resultsId}
										aria-label={formatMessage(messages.elementBrowserSearchPlaceholder)}
										isCompact
										name="registry-element-browser-search"
										onFocus={onSearchFocus}
										onChange={onSearchChange}
										onKeyDown={onKeyDown}
										placeholder={formatMessage(messages.elementBrowserSearchPlaceholder)}
										ref={searchInputRef}
										value={query}
									/>
									<IconButton
										appearance="subtle"
										icon={CrossIcon}
										label={formatMessage(messages.close)}
										onClick={closeBrowser}
										spacing="compact"
									/>
								</div>
							</div>
						</ModalHeader>
						<ModalBody hasInlinePadding={false}>
							<div
								css={browserLayoutStyles}
								onFocusCapture={onBrowserFocusCapture}
								ref={setBrowserLayoutRef}
							>
								<RegistryElementBrowserCategories
									section={effectiveSection}
									sections={model.sections}
									onSectionClick={onSectionClick}
									selectedButtonRef={selectedCategoryRef}
								/>
								<RegistryElementBrowserSearchResults
									editorView={editorView}
									emptyStateHandler={emptyStateHandler}
									isOffline={isOffline}
									items={regularItems}
									query={query}
									recommendedItems={recommendedItems}
									resultsId={resultsId}
									resultsRef={resultsRef}
									surfaceContext={surfaceContext}
									section={effectiveSection}
									selectedKey={selectedKey}
									onKeyDown={onKeyDown}
									onBlur={onResultsBlur}
									onFocus={onResultsFocus}
									onSelect={onRegistrySelect}
									showEmptyState={shouldRenderEmptyState}
									columnCount={columnCount}
									focusedRow={focusedRow}
									requestedRow={requestedRow}
									scrollElement={scrollElement}
								/>
							</div>
						</ModalBody>
					</ElementBrowserAnalyticsContext>
					<ModalFooter>
						<RegistryElementBrowserFooter
							helpUrl={helpUrl}
							isInsertEnabled={isSelectedRegistrationCurrent}
							onClose={closeBrowser}
							onConfirmInsert={confirmInsert}
							resultCount={visibleItems.length}
						/>
					</ModalFooter>
				</Modal>
			)}
		</ModalTransition>
	);
};
