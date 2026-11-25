/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useCallback, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl';

import { DropdownItem } from '@atlaskit/dropdown-menu/dropdown-item';
import { DropdownItemGroup } from '@atlaskit/dropdown-menu/dropdown-item-group';
import Button from '@atlaskit/editor-common/FloatingToolbar/Button';
import { messages } from '@atlaskit/editor-common/messages/card';
import { linkToolbarMessages } from '@atlaskit/editor-common/messages/link-toolbar';
import { ArrowKeyNavigationType } from '@atlaskit/editor-common/ui-menu/ArrowKeyNavigationProvider/types';
import { DropdownContainer as UiDropdown } from '@atlaskit/editor-common/ui-menu/DropdownContainer';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import EditIcon from '@atlaskit/icon/core/edit';
import ButtonItem from '@atlaskit/menu/button-item';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Flex } from '@atlaskit/primitives/compiled/flex';
import { token } from '@atlaskit/tokens';

import { focusEditorView } from '../../pm-plugins/utils';
import { editDatasource } from '../editDatasourceAction';
import type { EditDatasourceToolbarButtonWithCommonProps, EditVariant } from './types';

const dropdownExpandContainer = css({
	margin: `0px ${token('space.negative.050')}`,
});

interface EditToolbarPresentationProps extends EditDatasourceToolbarButtonWithCommonProps {
	datasourceId?: string;
	editVariant: EditVariant;
	extensionKey?: string;
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
}: EditToolbarPresentationProps): jsx.JSX.Element | null => {
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

	const editLinkLabel = intl.formatMessage(linkToolbarMessages.editLink);

	switch (editVariant) {
		case 'edit-link': {
			return (
				<Flex gap="space.050">
					<Button
						testId="edit-link"
						onClick={onEditLink}
						icon={<EditIcon label="" />}
						ariaLabel={editLinkLabel}
						tooltipContent={editLinkLabel}
					/>
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
						<FormattedMessage
							// Ignored via go/ees005
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...linkToolbarMessages.editDatasourceStandalone}
						/>
					</Button>
				</Flex>
			);
		}
		case 'edit-dropdown': {
			const useNewMenu = fg('platform-dst-new-menu');
			const MenuItem = useNewMenu ? DropdownItem : ButtonItem;
			const trigger = (
				<Flex gap="space.050">
					<Button
						testId="edit-dropdown-trigger"
						iconAfter={
							<span css={dropdownExpandContainer}>
								<ChevronDownIcon
									label={intl.formatMessage(messages.editDropdownTriggerTitle)}
									size="small"
								/>
							</span>
						}
						onClick={toggleOpen}
						selected={isOpen}
						disabled={false}
						ariaHasPopup
					>
						<FormattedMessage
							// Ignored via go/ees005
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...messages.editDropdownTriggerTitle}
						/>
					</Button>
				</Flex>
			);

			const items = (
				<Fragment>
					<MenuItem key="edit.link" onClick={onEditLink} testId="edit-dropdown-edit-link-item">
						<FormattedMessage
							// Ignored via go/ees005
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...messages.editDropdownEditLinkTitle}
						/>
					</MenuItem>
					<MenuItem
						key="edit.datasource"
						onClick={onEditDatasource}
						testId="edit-dropdown-edit-datasource-item"
					>
						<FormattedMessage
							// Ignored via go/ees005
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...messages.editDropdownEditDatasourceTitle}
						/>
					</MenuItem>
				</Fragment>
			);

			return (
				<Flex ref={containerRef}>
					<UiDropdown
						mountTo={containerRef.current}
						isOpen={isOpen}
						handleClickOutside={onClose}
						handleEscapeKeydown={onClose}
						trigger={trigger}
						fitWidth={useNewMenu ? 200 : undefined}
						scrollableElement={containerRef.current}
						// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
						arrowKeyNavigationProviderOptions={{
							type: ArrowKeyNavigationType.MENU,
						}}
					>
						{useNewMenu ? (
							<div role="menu">
								<DropdownItemGroup>{items}</DropdownItemGroup>
							</div>
						) : (
							items
						)}
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
