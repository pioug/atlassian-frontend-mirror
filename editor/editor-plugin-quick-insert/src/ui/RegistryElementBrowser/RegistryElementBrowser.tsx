/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { css } from '@compiled/react';
import { useIntl } from 'react-intl';

import { jsx } from '@atlaskit/css';
import IconButton from '@atlaskit/button/icon/button';
import Heading from '@atlaskit/heading/heading';
import { MENU, RECOMMENDED_SECTION } from '@atlaskit/editor-common/quick-insert/keys';
import type { QuickInsertSelectionHandler } from '@atlaskit/editor-common/quick-insert/context';
import type { EmptyStateHandler } from '@atlaskit/editor-common/types';
import { getMenuFooterSectionKey } from '@atlaskit/editor-common/type-ahead-get-menu-footer-section-key';
import { getSectionOverflowItemKey } from '@atlaskit/editor-common/type-ahead-get-section-overflow-item-key';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { RegisterComponent } from '@atlaskit/editor-ui-control-model/types';
import CrossIcon from '@atlaskit/icon/core/cross';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
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
} from './model';
import { RegistryElementBrowserCategories } from './RegistryElementBrowserCategories';
import { RegistryElementBrowserFooter } from './RegistryElementBrowserFooter';
import { RegistryElementBrowserSearchResults } from './RegistryElementBrowserSearchResults';

type Props = {
	components: RegisterComponent[];
	defaultSection?: string;
	editorView: EditorView;
	emptyStateHandler?: EmptyStateHandler;
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

const browserGridTemplateColumns = '182px minmax(0, 1fr)';
const categoryColumnGap = `calc(${token('space.200')} + ${token('space.150')})`;

const browserLayoutStyles = css({
	display: 'grid',
	gap: categoryColumnGap,
	gridTemplateColumns: browserGridTemplateColumns,
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

const resultsId = 'registry-element-browser-results';
const modalTestId = 'registry-element-browser-modal';

export const RegistryElementBrowser = ({
	components,
	emptyStateHandler,
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
	const model = useMemo(
		() =>
			createRegistryElementBrowserModel(components, {
				footerKey: getMenuFooterSectionKey(MENU.key),
				overflowKeys: new Set(
					components
						.filter((component) => component.type === 'menu-section')
						.map((component) => getSectionOverflowItemKey(component.key)),
				),
				recommendedSectionKey: RECOMMENDED_SECTION.key,
				rootKey: MENU.key,
			}),
		[components],
	);
	const [query, setQuery] = useState('');
	const [section, setSection] = useState<string | undefined>(() =>
		getInitialRegistryElementBrowserSection(model, defaultSection),
	);
	const [selectedKey, setSelectedKey] = useState<string>();
	const searchInputRef = useRef<HTMLInputElement>(null);
	const wasOpen = useRef(false);
	const previousIsOffline = useRef(isOffline);

	useEffect(() => {
		if (isOpen && !wasOpen.current) {
			setQuery('');
			setSection(getInitialRegistryElementBrowserSection(model, defaultSection));
			// This clears local visual state and the parent-held insertion handler together.
			// eslint-disable-next-line @atlassian/perf-linting/no-chain-state-updates
			setSelectedKey(undefined);
			onClearSelection();
		}
		wasOpen.current = isOpen;
	}, [defaultSection, isOpen, model, onClearSelection]);
	const items = useMemo(
		() =>
			getRegistryElementBrowserItems({
				formatMessage,
				model,
				query,
				section,
			}),
		[formatMessage, model, query, section],
	);
	useEffect(() => {
		if (previousIsOffline.current !== isOffline) {
			setSelectedKey(undefined);
			onClearSelection();
		}
		previousIsOffline.current = isOffline;
	}, [isOffline, onClearSelection]);

	const onSearchChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setQuery(event.currentTarget.value);
			setSelectedKey(undefined);
			onClearSelection();
		},
		[onClearSelection],
	);
	const onSectionClick = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			setQuery('');
			setSection(event.currentTarget.dataset.section || undefined);
			setSelectedKey(undefined);
			onClearSelection();
		},
		[onClearSelection],
	);
	const onClearSearch = useCallback(() => {
		setQuery('');
		setSelectedKey(undefined);
		onClearSelection();
		searchInputRef.current?.focus();
	}, [onClearSelection]);
	const onRegistrySelect = useCallback(
		(key: string, handler: QuickInsertSelectionHandler) => {
			setSelectedKey(key);
			onSelect(handler);
		},
		[onSelect],
	);
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
			if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
				const resultCollection = event.currentTarget.ownerDocument.getElementById(resultsId);
				const options = Array.from(
					resultCollection?.querySelectorAll<HTMLElement>(
						'[role="option"]:not([aria-disabled="true"]):not([disabled])',
					) ?? [],
				);
				const currentIndex = options.findIndex(
					(option) => option === event.currentTarget.ownerDocument.activeElement,
				);
				const nextIndex = event.key === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1;
				const nextOption = options.at(nextIndex);
				if (nextOption) {
					event.preventDefault();
					nextOption.focus();
				}
				return;
			}

			if (event.key === 'Escape') {
				event.preventDefault();
				onClose();
				return;
			}

			if (event.key === 'Enter' && selectedKey) {
				event.preventDefault();
				onConfirmInsert();
			}
		},
		[onClose, onConfirmInsert, selectedKey],
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
					onClose={onClose}
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
									onChange={onSearchChange}
									onKeyDown={onKeyDown}
									ref={searchInputRef}
									value={query}
								/>
								<IconButton
									appearance="subtle"
									icon={CrossIcon}
									label={formatMessage({
										defaultMessage: 'Clear search',
										id: 'editor.quick-insert.clear-search',
									})}
									onClick={onClearSearch}
									spacing="compact"
								/>
							</div>
						</div>
					</ModalHeader>
					<ModalBody>
						<div css={browserLayoutStyles}>
							<RegistryElementBrowserCategories
								section={section}
								sections={model.sections}
								onSectionClick={onSectionClick}
							/>
							<RegistryElementBrowserSearchResults
								editorView={editorView}
								emptyStateHandler={emptyStateHandler}
								isLoading={isLoading}
								isOffline={isOffline}
								items={items}
								query={query}
								resultsId={resultsId}
								section={section}
								selectedKey={selectedKey}
								onKeyDown={onKeyDown}
								onSelect={onRegistrySelect}
							/>
						</div>
					</ModalBody>
					<ModalFooter>
						<RegistryElementBrowserFooter
							helpUrl={helpUrl}
							isInsertEnabled={Boolean(selectedKey)}
							onClose={onClose}
							onConfirmInsert={onConfirmInsert}
							resultCount={items.length}
						/>
					</ModalFooter>
				</Modal>
			)}
		</ModalTransition>
	);
};
