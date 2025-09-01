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
import Link from '@atlaskit/link';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { fg } from '@atlaskit/platform-feature-flags';

import { messages } from '../../../messages';

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

const WarningModal = (props: LinkWarningModalProps & WrappedComponentProps) => {
	const { isOpen, unsafeLinkText, url, onClose, onContinue, intl } = props;

	const content = (
		<ModalTransition>
			{isOpen && (
				<Modal onClose={onClose} testId="link-with-safety-warning">
					<ModalHeader hasCloseButton={fg('navx-1483-a11y-close-button-in-modal-updates')}>
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
											<Link href={url} target="_blank" rel="noopener noreferrer">
												{url}
											</Link>
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

export default injectIntl(WarningModal, {
	enforceContext: false,
});
