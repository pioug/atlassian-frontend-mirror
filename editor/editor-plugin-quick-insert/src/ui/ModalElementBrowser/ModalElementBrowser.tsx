/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import Button from '@atlaskit/button';
import { ElementBrowser } from '@atlaskit/editor-common/element-browser';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import { messages } from '@atlaskit/editor-common/quick-insert';
import type { EmptyStateHandler } from '@atlaskit/editor-common/types';
import QuestionCircleIcon from '@atlaskit/icon/core/migration/question-circle';
import Modal, { ModalTransition, useModal } from '@atlaskit/modal-dialog';
import { fg } from '@atlaskit/platform-feature-flags';
import { N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { getCategories } from './categories';

export const MODAL_WRAPPER_PADDING = 16;

export interface Props {
	emptyStateHandler?: EmptyStateHandler;
	getItems: (query?: string, category?: string) => QuickInsertItem[];
	helpUrl?: string | undefined;
	isOpen?: boolean;
	onClose: () => void;
	onCloseComplete: () => void;
	onInsertItem: (item: QuickInsertItem) => void;
	shouldReturnFocus?: boolean;
}

const actionsStyles = css({
	display: 'inline-flex',
	margin: `0 ${token('space.negative.050', '-4px')}`,
});

const actionItemStyles = css({
	flex: '1 0 auto',
	margin: `0 ${token('space.050', '4px')}`,
});

const wrapperStyles = css({
	display: 'flex',
	flex: '1 1 auto',
	boxSizing: 'border-box',
	padding: `${token('space.200', '16px')} ${token('space.200', '16px')} 0 10px`,
	overflow: 'hidden',
	backgroundColor: token('elevation.surface.overlay', N0),
	borderRadius: token('radius.small', '3px'),
});

const modalFooterStyles = css({
	display: 'flex',
	padding: `${token('space.200', '16px')}`,

	position: 'relative',
	alignItems: 'center',
	justifyContent: 'space-between',
});

const ModalElementBrowser = (props: Props & WrappedComponentProps) => {
	const [selectedItem, setSelectedItem] = useState<QuickInsertItem>();
	const { helpUrl, intl, onClose, onInsertItem: onInsertItemFn } = props;

	const onSelectItem = useCallback(
		(item: QuickInsertItem) => {
			setSelectedItem(item);
		},
		[setSelectedItem],
	);

	const onInsertItem = useCallback(
		(item: QuickInsertItem) => {
			onInsertItemFn(item);
		},
		[onInsertItemFn],
	);

	const RenderFooter = useCallback(
		() => (
			<Footer
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				onInsert={() => onInsertItem(selectedItem!)}
				beforeElement={helpUrl ? HelpLink(helpUrl, intl.formatMessage(messages.help)) : undefined}
			/>
		),
		[onInsertItem, selectedItem, helpUrl, intl],
	);

	// remove when cleaning up platform_editor_modal_element_browser_a11y
	// Since Modal uses stackIndex it's shouldCloseOnEscapePress prop doesn't work.
	const onKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		},
		[onClose],
	);

	const RenderBody = useCallback(
		() => (
			<div css={wrapperStyles}>
				<ElementBrowser
					categories={getCategories(props.intl)}
					getItems={props.getItems}
					showSearch={true}
					showCategories
					mode="full"
					onSelectItem={onSelectItem}
					onInsertItem={onInsertItem}
					emptyStateHandler={props.emptyStateHandler}
				/>
			</div>
		),
		[props.intl, props.getItems, onSelectItem, onInsertItem, props.emptyStateHandler],
	);

	return fg('platform_editor_modal_element_browser_a11y') ? (
		<div data-editor-popup={true}>
			<ModalTransition>
				{props.isOpen && (
					<Modal
						testId="element-browser-modal-dialog"
						stackIndex={0}
						key="element-browser-modal"
						onClose={props.onClose}
						onCloseComplete={props.onCloseComplete}
						height="664px"
						width="x-large"
						shouldReturnFocus={props.shouldReturnFocus}
					>
						<RenderBody />
						<RenderFooter />
					</Modal>
				)}
			</ModalTransition>
		</div>
	) : (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions, @atlassian/a11y/interactive-element-not-keyboard-focusable
		<div data-editor-popup={true} onClick={onModalClick} onKeyDown={onKeyDown}>
			<ModalTransition>
				{props.isOpen && (
					<Modal
						testId="element-browser-modal-dialog"
						stackIndex={0}
						key="element-browser-modal"
						onClose={props.onClose}
						onCloseComplete={props.onCloseComplete}
						height="664px"
						width="x-large"
						autoFocus={false}
						shouldReturnFocus={props.shouldReturnFocus}
						// defaults to true and doesn't work along with stackIndex=1.
						// packages/design-system/modal-dialog/src/components/Content.tsx Line 287
						shouldCloseOnEscapePress={false}
					>
						<RenderBody />
						<RenderFooter />
					</Modal>
				)}
			</ModalTransition>
		</div>
	);
};

ModalElementBrowser.displayName = 'ModalElementBrowser';

// remove when cleaning up platform_editor_modal_element_browser_a11y
// Prevent ModalElementBrowser click propagation through to the editor.
const onModalClick = (e: React.MouseEvent) => e.stopPropagation();

const Footer = ({
	onInsert,
	beforeElement,
}: {
	beforeElement?: JSX.Element;
	onInsert: () => void;
}) => {
	const { onClose } = useModal();
	return (
		<div css={modalFooterStyles}>
			{beforeElement ? beforeElement : <span />}
			<div css={actionsStyles}>
				<div css={actionItemStyles}>
					<Button
						appearance="primary"
						onClick={onInsert}
						testId="ModalElementBrowser__insert-button"
					>
						Insert
					</Button>
				</div>
				<div css={actionItemStyles}>
					<Button appearance="subtle" onClick={onClose} testId="ModalElementBrowser__close-button">
						Close
					</Button>
				</div>
			</div>
		</div>
	);
};

const HelpLink = (url: string, helpText: string) => (
	<Button
		iconBefore={<QuestionCircleIcon label="" />}
		appearance="subtle-link"
		href={url}
		target="_blank"
		testId="ModalElementBrowser__help-button"
	>
		{helpText}
	</Button>
);

export default injectIntl(ModalElementBrowser);
