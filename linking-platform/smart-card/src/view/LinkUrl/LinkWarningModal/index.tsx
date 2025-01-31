/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import {
	FormattedMessage,
	injectIntl,
	IntlProvider,
	type WrappedComponentProps,
} from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { fg } from '@atlaskit/platform-feature-flags';

import { messages } from '../../../messages';

import WarningModalOld from './WarningModalOld';

const breakWordsCss = css({
	whiteSpace: 'pre-line',
	wordBreak: 'break-all',
});

export type LinkWarningModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onContinue: () => void;
	unsafeLinkText: string | null;
	url: string | null;
};

const WarningModalNew = (props: LinkWarningModalProps & WrappedComponentProps) => {
	const { isOpen, unsafeLinkText, url, onClose, onContinue, intl } = props;

	const content = (
		<ModalTransition>
			{isOpen && (
				<Modal onClose={onClose} testId="link-with-safety-warning">
					<ModalHeader>
						<ModalTitle appearance="warning">
							<FormattedMessage {...messages.check_this_link} />
						</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<div css={breakWordsCss}>
							{url && unsafeLinkText && (
								<FormattedMessage
									{...messages.link_safety_warning_message}
									values={{
										unsafeLinkText: unsafeLinkText,
										a: () => (
											<a href={url} target="_blank" rel="noopener noreferrer">
												{url}
											</a>
										),
									}}
								/>
							)}
						</div>
					</ModalBody>
					<ModalFooter>
						<Button appearance="subtle" onClick={onClose}>
							<FormattedMessage {...messages.go_back} />
						</Button>
						<Button appearance="warning" onClick={onContinue} autoFocus>
							<FormattedMessage {...messages.continue} />
						</Button>
					</ModalFooter>
				</Modal>
			)}
		</ModalTransition>
	);

	return intl ? content : <IntlProvider locale="en">{content}</IntlProvider>;
};

const Component = (props: LinkWarningModalProps & WrappedComponentProps) => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <WarningModalNew {...props} />;
	}
	return <WarningModalOld {...props} />;
};

export default injectIntl(Component, {
	enforceContext: false,
});
