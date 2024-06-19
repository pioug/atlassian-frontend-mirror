/** @jsx jsx */
import { useCallback, useMemo, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { FormattedMessage, type IntlShape } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { linkToolbarMessages, cardMessages as messages } from '@atlaskit/editor-common/messages';
import type { Command } from '@atlaskit/editor-common/types';
import {
	FloatingToolbarButton as Button,
	FloatingToolbarSeparator as Separator,
} from '@atlaskit/editor-common/ui';
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

import { type CardType } from '../types';
import { editDatasource } from '../ui/EditDatasourceButton';
import { focusEditorView, isDatasourceConfigEditable } from '../utils';

import { CardContextProvider } from './CardContextProvider';
import { useFetchDatasourceInfo } from './useFetchDatasourceInfo';

export interface EditDatasourceToolbarButtonProps {
	datasourceId?: string;
	intl: IntlShape;
	onLinkEditClick: Command;
	editorAnalyticsApi?: EditorAnalyticsAPI;
	url?: string;
	editorView?: EditorView;
	cardContext?: CardContext;
	currentAppearance?: CardType;
}

const dropdownExpandContainer = css({
	margin: `0px ${token('space.negative.050', '-4px')}`,
});

type EditVariant = 'none' | 'edit-link' | 'edit-datasource' | 'edit-dropdown';

const EditToolbarButtonWithCardContext = (props: EditDatasourceToolbarButtonProps) => {
	const {
		cardContext,
		currentAppearance,
		editorAnalyticsApi,
		editorView,
		intl,
		onLinkEditClick,
		url,
	} = props;
	const { extensionKey, ...response } = useFetchDatasourceInfo({
		isRegularCardNode: true,
		url,
		cardContext,
	});
	const datasourceId = response.datasourceId ?? props.datasourceId;

	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef();

	const toggleOpen = () => setIsOpen((open) => !open);

	const onClose = () => setIsOpen(false);

	const onEditLink = useCallback(() => {
		if (editorView) {
			onLinkEditClick(editorView.state, editorView.dispatch);
			focusEditorView(editorView);
		}
	}, [editorView, onLinkEditClick]);

	const editVariant = useMemo<EditVariant>(() => {
		const hasUrl = url !== null && url !== undefined;
		if (!datasourceId || !isDatasourceConfigEditable(datasourceId)) {
			if (hasUrl) {
				return 'edit-link';
			}
			return 'none';
		}
		if (hasUrl) {
			const urlState = cardContext?.store?.getState()[url];
			if (urlState?.error?.kind === 'fatal') {
				return 'edit-link';
			}
			return 'edit-dropdown';
		} else {
			return 'edit-datasource';
		}
	}, [cardContext?.store, datasourceId, url]);

	const onEditDatasource = useCallback(() => {
		if (editorView && datasourceId) {
			editDatasource(
				datasourceId,
				editorAnalyticsApi,
				currentAppearance,
				extensionKey,
			)(editorView.state, editorView.dispatch);
			focusEditorView(editorView);
		}
	}, [currentAppearance, datasourceId, editorAnalyticsApi, editorView, extensionKey]);

	switch (editVariant) {
		case 'edit-link': {
			return (
				<Flex gap="space.050">
					<Button testId="edit-link" onClick={onEditLink}>
						<FormattedMessage {...linkToolbarMessages.editLink} />
					</Button>
					<Separator />
				</Flex>
			);
		}
		case 'edit-datasource': {
			return (
				<Flex gap="space.050">
					<Button
						testId="edit-datasource"
						tooltipContent={intl.formatMessage(linkToolbarMessages.editDatasourceStandaloneTooltip)}
						onClick={onEditDatasource}
					>
						<FormattedMessage {...linkToolbarMessages.editDatasourceStandalone} />
					</Button>
					<Separator />
				</Flex>
			);
		}
		case 'edit-dropdown': {
			const trigger = (
				<Flex gap="space.050">
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
					<Separator />
				</Flex>
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
		}
		case 'none':
		default:
			return null;
	}
};

export const EditToolbarButton = (props: EditDatasourceToolbarButtonProps) => {
	const {
		currentAppearance,
		datasourceId,
		editorAnalyticsApi,
		editorView,
		intl,
		onLinkEditClick,
		url,
	} = props;
	return (
		<CardContextProvider>
			{({ cardContext }) => (
				<EditToolbarButtonWithCardContext
					datasourceId={datasourceId}
					url={url}
					intl={intl}
					editorAnalyticsApi={editorAnalyticsApi}
					editorView={editorView}
					cardContext={cardContext}
					onLinkEditClick={onLinkEditClick}
					currentAppearance={currentAppearance}
				/>
			)}
		</CardContextProvider>
	);
};
