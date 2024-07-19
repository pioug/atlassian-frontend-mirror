/** @jsx jsx */
import { useCallback, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { linkToolbarMessages, cardMessages as messages } from '@atlaskit/editor-common/messages';
import {
	FloatingToolbarButton as Button,
	FloatingToolbarSeparator as Separator,
} from '@atlaskit/editor-common/ui';
import {
	ArrowKeyNavigationType,
	DropdownContainer as UiDropdown,
} from '@atlaskit/editor-common/ui-menu';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import { ButtonItem } from '@atlaskit/menu';
import { Flex } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { focusEditorView } from '../../utils';
import { editDatasource } from '../EditDatasourceButton';

import type { EditDatasourceToolbarButtonWithCommonProps, EditVariant } from './types';

const dropdownExpandContainer = css({
	margin: `0px ${token('space.negative.050', '-4px')}`,
});

interface EditToolbarPresentationProps extends EditDatasourceToolbarButtonWithCommonProps {
	extensionKey?: string;
	datasourceId?: string;
	editVariant: EditVariant;
}

const EditToolbarButtonPresentation = ({
	datasourceId,
	currentAppearance,
	editorAnalyticsApi,
	editVariant,
	editorView,
	extensionKey,
	onLinkEditClick,
	intl,
}: EditToolbarPresentationProps) => {
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

export default EditToolbarButtonPresentation;
