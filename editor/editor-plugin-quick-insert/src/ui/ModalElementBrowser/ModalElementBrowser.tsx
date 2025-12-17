/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl, useIntl } from 'react-intl-next';

import Button from '@atlaskit/button';
import { ElementBrowser } from '@atlaskit/editor-common/element-browser';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import { messages } from '@atlaskit/editor-common/quick-insert';
import type { EmptyStateHandler } from '@atlaskit/editor-common/types';
import QuestionCircleIcon from '@atlaskit/icon/core/migration/question-circle';
import Modal, { CloseButton, ModalTransition, useModal } from '@atlaskit/modal-dialog';
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

const modalCloseButtonStyles = css({
	display: 'flex',
	justifyContent: 'flex-end',
	paddingBlockStart: token('space.200'),
	paddingInline: token('space.200'),
});

const ModalElementBrowser = (props: Props & WrappedComponentProps) => {
	const [selectedItem, setSelectedItem] = useState<QuickInsertItem>();
	const { helpUrl, intl, onInsertItem: onInsertItemFn } = props;

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
					autoFocusSearch={false}
				/>
			</div>
		),
		[props.intl, props.getItems, onSelectItem, onInsertItem, props.emptyStateHandler],
	);

	const label = fg('platform_editor_fix_browse_modal_header')
		? intl.formatMessage(messages.browse)
		: undefined;

	return (
		<div data-editor-popup={true}>
			<ModalTransition>
				{props.isOpen && (
					<Modal
						label={label}
						testId="element-browser-modal-dialog"
						stackIndex={0}
						key="element-browser-modal"
						onClose={props.onClose}
						onCloseComplete={props.onCloseComplete}
						height="664px"
						width="x-large"
						shouldReturnFocus={props.shouldReturnFocus}
					>
						<div css={modalCloseButtonStyles}>
							<CloseButton onClick={props.onClose} />
						</div>
						<RenderBody />
						<RenderFooter />
					</Modal>
				)}
			</ModalTransition>
		</div>
	);
};

ModalElementBrowser.displayName = 'ModalElementBrowser';

const Footer = ({
	onInsert,
	beforeElement,
}: {
	beforeElement?: JSX.Element;
	onInsert: () => void;
}) => {
	const intl = useIntl();
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
						{fg('platform_editor_dec_a11y_fixes')
							? intl.formatMessage(messages.insert)
							: 'Insert'}
					</Button>
				</div>
				<div css={actionItemStyles}>
					<Button
						appearance="subtle"
						onClick={onClose}
						testId="ModalElementBrowser__close-button"
					>
						{fg('platform_editor_dec_a11y_fixes')
							? intl.formatMessage(messages.close)
							: 'Close'}
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
