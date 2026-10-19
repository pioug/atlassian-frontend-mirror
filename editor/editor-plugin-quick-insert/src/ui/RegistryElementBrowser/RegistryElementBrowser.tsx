/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { css } from '@compiled/react';
import { useIntl } from 'react-intl';

import IconButton from '@atlaskit/button/icon/button';
import { jsx } from '@atlaskit/css';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics/api';
// eslint-disable-next-line @atlaskit/platform/no-barrel-entry-imports
import { messages } from '@atlaskit/editor-common/quick-insert';
import type { QuickInsertSelectionHandler } from '@atlaskit/editor-common/quick-insert/context';
import { MENU, RECOMMENDED_SECTION } from '@atlaskit/editor-common/quick-insert/keys';
import { useQuickInsertSearchAnalytics } from '@atlaskit/editor-common/quick-insert/use-search-analytics';
import { getMenuFooterSectionKey } from '@atlaskit/editor-common/type-ahead-get-menu-footer-section-key';
import { getSectionOverflowItemKey } from '@atlaskit/editor-common/type-ahead-get-section-overflow-item-key';
import type { EmptyStateHandler } from '@atlaskit/editor-common/types/empty-state-handler';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { RegisterComponent, RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';
import Heading from '@atlaskit/heading/heading';
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

import {
	createRegistryElementBrowserModel,
	getInitialRegistryElementBrowserSection,
	getRegistryElementBrowserItems,
	type RegistryElementBrowserItem,
} from './model';
import { RegistryElementBrowserCategories } from './RegistryElementBrowserCategories';
import { RegistryElementBrowserFooter } from './RegistryElementBrowserFooter';
import { RegistryElementBrowserSearchResults } from './RegistryElementBrowserSearchResults';

type Props = {
	components: RegisterComponent[];
	defaultSection?: string;
	editorView: EditorView;
	emptyStateHandler?: EmptyStateHandler;
	fireAnalyticsEvent?: EditorAnalyticsAPI['fireAnalyticsEvent'];
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

const browserLayoutStyles = css({
	display: 'grid',
	gap: categoryColumnGap,
	gridTemplateColumns: browserGridTemplateColumns,
	paddingBlockStart: token('space.050'),
	paddingInline: token('space.050'),
	'@media (max-width: 599px)': {
		gridTemplateColumns: 'minmax(0, 1fr)',
	},
});

const headerContentStyles = css({
	display: 'grid',
	gap: categoryColumnGap,
	gridTemplateColumns: browserGridTemplateColumns,
	width: '100%',
	'@media (max-width: 599px)': {
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

const EMPTY_ITEMS: RegistryElementBrowserItem[] = [];

const resultsId = 'registry-element-browser-results';
const modalTestId = 'registry-element-browser-modal';

const getRenderedColumnCount = (options: HTMLElement[]): number => {
	const firstRowTop = options[0]?.getBoundingClientRect().top;
	const nextRowIndex = options.findIndex(
		(option) => firstRowTop !== undefined && option.getBoundingClientRect().top > firstRowTop + 1,
	);
	return nextRowIndex > 0 ? nextRowIndex : options.length;
};

export const RegistryElementBrowser = ({
	components,
	emptyStateHandler,
	fireAnalyticsEvent,
	defaultSection,
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
	const [browserState, setBrowserState] = useState<BrowserState>({
		query: '',
		section: defaultSection,
	});
	const { query, section, selectedRegistration } = browserState;
	const selectedRegistrationRef = useRef<RegisterMenuItem | undefined>(undefined);
	const browserModel = useMemo(() => {
		const model = createRegistryElementBrowserModel(components, {
			footerKey: getMenuFooterSectionKey(MENU.key),
			overflowKeys: new Set(
				components
					.filter((component) => component.type === 'menu-section')
					.map((component) => getSectionOverflowItemKey(component.key)),
			),
			recommendedSectionKey: RECOMMENDED_SECTION.key,
			rootKey: MENU.key,
		});
		const effectiveSection =
			section && model.sections.some(({ key }) => key === section) ? section : undefined;
		return {
			model,
			effectiveSection,
			items: getRegistryElementBrowserItems({
				formatMessage,
				model,
				query,
				section: effectiveSection,
			}),
		};
	}, [components, formatMessage, query, section]);
	const { model, effectiveSection, items } = browserModel;
	const visibleItems =
		items.length === 0 && !isLoading && query.trim().length > 0
			? (model.fallbackItems ?? EMPTY_ITEMS)
			: items;
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
	const selectedCategoryRef = useRef<HTMLButtonElement>(null);
	const focusedCategoryRef = useRef<string | undefined>();
	const handledInvalidationRef = useRef(browserState.invalidation);
	const wasOpen = useRef(false);

	useEffect(() => {
		if (isOpen && !wasOpen.current) {
			selectedRegistrationRef.current = undefined;
			setBrowserState({
				query: '',
				section: getInitialRegistryElementBrowserSection(model, defaultSection),
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

	const resultCount =
		items.length || (!isLoading && query.trim() ? (model.fallbackItems?.length ?? 0) : 0);
	const flushSearchAnalytics = useQuickInsertSearchAnalytics({
		query,
		resultCount: items.length,
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
			selectedRegistrationRef.current = undefined;
			setBrowserState((current) => ({
				...current,
				query: nextQuery,
				selectedRegistration: undefined,
			}));
			onClearSelection();
		},
		[onClearSelection],
	);
	const onSectionClick = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			const nextSection = event.currentTarget.dataset.section || undefined;
			selectedRegistrationRef.current = undefined;
			setBrowserState({
				query: '',
				section: nextSection,
				selectedRegistration: undefined,
			});
			onClearSelection();
		},
		[onClearSelection],
	);
	const onRegistrySelect = useCallback(
		(key: string, handler: QuickInsertSelectionHandler) => {
			const registration = model.items.find(
				({ registration }) => registration.key === key,
			)?.registration;
			selectedRegistrationRef.current = registration;
			setBrowserState((current) => ({
				...current,
				selectedRegistration: registration,
				selectionIsOffline: isOffline,
			}));
			onSelect(handler);
		},
		[isOffline, model.items, onSelect],
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

			if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
				if (
					event.currentTarget === searchInputRef.current &&
					(event.key === 'ArrowLeft' || event.key === 'ArrowRight')
				) {
					return;
				}

				const resultCollection = event.currentTarget.ownerDocument.getElementById(resultsId);
				const options = Array.from(
					resultCollection?.querySelectorAll<HTMLElement>('[role="option"]') ?? [],
				);
				const currentIndex = options.findIndex(
					(option) => option === event.currentTarget.ownerDocument.activeElement,
				);
				const columnCount = getRenderedColumnCount(options);
				const step =
					event.key === 'ArrowDown'
						? columnCount
						: event.key === 'ArrowUp'
							? -columnCount
							: event.key === 'ArrowRight'
								? 1
								: -1;
				let nextIndex = currentIndex < 0 ? 0 : currentIndex + step;
				if (event.key === 'ArrowDown' && columnCount < options.length) {
					nextIndex = Math.min(nextIndex, options.length - 1);
				}
				while (
					nextIndex >= 0 &&
					nextIndex < options.length &&
					(options[nextIndex].hasAttribute('disabled') ||
						options[nextIndex].getAttribute('aria-disabled') === 'true')
				) {
					nextIndex += step;
				}
				const nextOption = options[nextIndex];
				if (nextOption) {
					event.preventDefault();
					nextOption.focus();
					nextOption.click();
				} else if (nextIndex < 0 && currentIndex >= 0) {
					event.preventDefault();
					searchInputRef.current?.focus();
				}
				return;
			}

			if (event.key === 'Escape') {
				event.preventDefault();
				closeBrowser();
				return;
			}

			if (event.key === 'Enter') {
				const focusedOption =
					event.target instanceof HTMLElement
						? event.target.closest<HTMLElement>('[role="option"]')
						: null;
				const firstOption = event.currentTarget.ownerDocument
					.getElementById(resultsId)
					?.querySelector<HTMLElement>(
						'[role="option"]:not([aria-disabled="true"]):not([disabled])',
					);
				const optionToActivate = focusedOption ?? firstOption;
				if (isSelectedRegistrationCurrent || optionToActivate) {
					event.preventDefault();
					if (!isSelectedRegistrationCurrent) {
						optionToActivate?.click();
					}
					confirmInsert();
				}
			}
		},
		[closeBrowser, confirmInsert, isSelectedRegistrationCurrent],
	);

	return (
		<ModalTransition>
			{isOpen && (
				<Modal
					label={formatMessage({
						defaultMessage: 'Insert elements',
						id: 'editor.quick-insert.title',
					})}
					height="664px"
					onClose={closeBrowser}
					onCloseComplete={onCloseComplete}
					onOpenComplete={onModalOpenComplete}
					testId={modalTestId}
					width="min(968px, calc(100vw - 32px))"
				>
					<ModalHeader>
						<div css={headerContentStyles}>
							{fg('platform_dst_modal-dialog-use-modal-title') ? (
								<ModalTitle>
									{formatMessage({
										defaultMessage: 'Insert elements',
										id: 'editor.quick-insert.title',
									})}
								</ModalTitle>
							) : (
								<Heading size="medium">
									{formatMessage({
										defaultMessage: 'Insert elements',
										id: 'editor.quick-insert.title',
									})}
								</Heading>
							)}
							<div css={headerSearchStyles}>
								<Textfield
									autoFocus
									aria-controls={resultsId}
									aria-label={formatMessage({
										defaultMessage: 'Search elements',
										id: 'editor.quick-insert.search',
									})}
									isCompact
									name="registry-element-browser-search"
									onFocus={onSearchFocus}
									onChange={onSearchChange}
									onKeyDown={onKeyDown}
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
					<ModalBody>
						<div css={browserLayoutStyles} onFocusCapture={onBrowserFocusCapture}>
							<RegistryElementBrowserCategories
								section={effectiveSection}
								sections={model.sections}
								onSectionClick={onSectionClick}
								selectedButtonRef={selectedCategoryRef}
							/>
							<RegistryElementBrowserSearchResults
								editorView={editorView}
								emptyStateHandler={emptyStateHandler}
								isLoading={isLoading}
								isOffline={isOffline}
								items={items}
								fallbackItems={model.fallbackItems}
								query={query}
								resultsId={resultsId}
								section={effectiveSection}
								selectedKey={selectedKey}
								onKeyDown={onKeyDown}
								onSelect={onRegistrySelect}
							/>
						</div>
					</ModalBody>
					<ModalFooter>
						<RegistryElementBrowserFooter
							helpUrl={helpUrl}
							isInsertEnabled={isSelectedRegistrationCurrent}
							onClose={closeBrowser}
							onConfirmInsert={confirmInsert}
							resultCount={resultCount}
						/>
					</ModalFooter>
				</Modal>
			)}
		</ModalTransition>
	);
};
