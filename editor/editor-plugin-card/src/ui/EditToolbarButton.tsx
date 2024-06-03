/** @jsx jsx */
import { useCallback, useMemo, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';
import { FormattedMessage, type IntlShape } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { linkToolbarMessages, cardMessages as messages } from '@atlaskit/editor-common/messages';
import type { Command } from '@atlaskit/editor-common/types';
import { FloatingToolbarButton as Button } from '@atlaskit/editor-common/ui';
import {
	ArrowKeyNavigationType,
	DropdownContainer as UiDropdown,
} from '@atlaskit/editor-common/ui-menu';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import type { CardContext } from '@atlaskit/link-provider';
import { ButtonItem } from '@atlaskit/menu';
import { Flex } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { editDatasource } from '../pm-plugins/doc';
import { isDatasourceConfigEditable } from '../utils';

import { CardContextProvider } from './CardContextProvider';
import { useFetchDatasourceInfo } from './useFetchDatasourceInfo';

export interface EditToolbarButtonProps {
	intl: IntlShape;
	editorAnalyticsApi?: EditorAnalyticsAPI;
	url?: string;
	editorView?: EditorView;
	cardContext?: CardContext;
	onLinkEditClick: Command;
}

const dropdownExpandContainer = css({
	margin: `0px ${token('space.negative.050', '-4px')}`,
});

const EditButtonWithCardContext = ({
	cardContext,
	intl,
	editorAnalyticsApi,
	url,
	editorView,
	onLinkEditClick,
}: EditToolbarButtonProps) => {
	const { datasourceId } = useFetchDatasourceInfo({
		isRegularCardNode: true,
		url,
		cardContext,
	});
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef();
	const toggleOpen = () => setIsOpen((open) => !open);

	const onClose = () => setIsOpen(false);

	const dispatchCommand = useCallback(
		(fn?: Function) => {
			if (editorView) {
				fn?.(editorView.state, editorView.dispatch);

				if (!editorView.hasFocus()) {
					editorView.focus();
				}
			}
		},
		[editorView],
	);

	const onEditLink = useCallback(() => {
		dispatchCommand(onLinkEditClick);
	}, [dispatchCommand, onLinkEditClick]);

	const shouldFallbackToEditButton = useMemo(() => {
		if (!datasourceId || !isDatasourceConfigEditable(datasourceId)) {
			return true;
		}
		if (url) {
			const urlState = cardContext?.store?.getState()[url];
			if (urlState?.error?.kind === 'fatal') {
				return true;
			}
		}
		return false;
	}, [cardContext?.store, datasourceId, url]);

	const onEditDatasource = useCallback(() => {
		if (datasourceId) {
			dispatchCommand(editDatasource(datasourceId, editorAnalyticsApi));
		}
	}, [dispatchCommand, datasourceId, editorAnalyticsApi]);

	if (shouldFallbackToEditButton) {
		return (
			<Button testId="edit-link" onClick={onEditLink}>
				<FormattedMessage {...linkToolbarMessages.editLink} />
			</Button>
		);
	}

	const trigger = (
		<Button
			testId="edit-dropdown-trigger"
			iconAfter={
				<span css={dropdownExpandContainer}>
					<ExpandIcon label={intl.formatMessage(messages.editDropdownTriggerTitle)} />
				</span>
			}
			onClick={toggleOpen}
			selected={isOpen}
			disabled={false}
			ariaHasPopup
		>
			<FormattedMessage {...messages.editDropdownTriggerTitle} />
		</Button>
	);

	return (
		<Flex ref={containerRef}>
			<UiDropdown
				mountTo={containerRef.current}
				isOpen={isOpen}
				handleClickOutside={onClose}
				handleEscapeKeydown={onClose}
				trigger={trigger}
				scrollableElement={containerRef.current}
				arrowKeyNavigationProviderOptions={{
					type: ArrowKeyNavigationType.MENU,
				}}
			>
				<ButtonItem key="edit.link" onClick={onEditLink} testId="edit-dropdown-edit-link-item">
					<FormattedMessage {...messages.editDropdownEditLinkTitle} />
				</ButtonItem>
				<ButtonItem
					key="edit.datasource"
					onClick={onEditDatasource}
					testId="edit-dropdown-edit-datasource-item"
				>
					<FormattedMessage {...messages.editDropdownEditDatasourceTitle} />
				</ButtonItem>
			</UiDropdown>
		</Flex>
	);
};

export const EditToolbarButton = ({
	intl,
	editorAnalyticsApi,
	url,
	editorView,
	onLinkEditClick,
}: EditToolbarButtonProps) => {
	return (
		<CardContextProvider>
			{({ cardContext }) => (
				<EditButtonWithCardContext
					url={url}
					intl={intl}
					editorAnalyticsApi={editorAnalyticsApi}
					editorView={editorView}
					cardContext={cardContext}
					onLinkEditClick={onLinkEditClick}
				/>
			)}
		</CardContextProvider>
	);
};
