import React, { useRef, useState } from 'react';

import { parse } from 'query-string';
import { FormattedMessage, useIntl } from 'react-intl-next';

import Button, { type Appearance } from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import { ErrorMessage } from '@atlaskit/form';
import Heading from '@atlaskit/heading';
import ModalDialog, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Box, Text } from '@atlaskit/primitives/compiled';

import { defaultMessages } from './messages';

export interface AuditLogExportButtonProps {
	/** Function to call when export fails */
	onError?: () => void;
	/** Function to call when export is initiated. Should handle the actual export logic. */
	onExport: (params: {
		action?: string;
		actor?: string;
		from?: string;
		ip?: string;
		location?: string;
		orgId: string;
		product?: string;
		q?: string;
		to?: string;
	}) => Promise<void>;
	/** Function to call when export succeeds */
	onSuccess?: () => void;
	/** Organization ID for the export */
	orgId: string;
	/** Search parameters as a string (e.g., "?from=2023-01-01&to=2023-12-31") */
	search?: string;
	/** Optional test ID for the export button */
	testId?: string;
}

export const AuditLogExportButton = ({
	onExport,
	onSuccess,
	onError,
	orgId,
	search = '',
	testId = 'audit-log-export-button',
}: AuditLogExportButtonProps) => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isTermsChecked, setIsTermsChecked] = useState<boolean>(false);
	const [hasTermsError, setHasTermsError] = useState<boolean>(false);
	const { formatMessage } = useIntl();
	const checkboxRef = useRef<HTMLInputElement>(null);

	const onClose = () => {
		closeModal();
	};

	const onCheckBoxChange = () => {
		if (!isTermsChecked) {
			setHasTermsError(false);
		}

		setIsTermsChecked(!isTermsChecked);
	};

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsLoading(false);
		setIsModalOpen(false);
		setIsTermsChecked(false);
		setHasTermsError(false);
	};

	const startExport = async () => {
		if (!isTermsChecked) {
			setHasTermsError(true);

			// Focus the checkbox after a brief delay to ensure error is rendered
			setTimeout(() => {
				checkboxRef.current?.focus();
			}, 100);

			return;
		}

		const { from, to, q, action, actor, ip, location, product } = parse(search) as any;

		if (isLoading) {
			return;
		}
		setIsLoading(true);

		try {
			await onExport({ orgId, to, from, q, action, actor, ip, location, product });

			onSuccess?.();
		} catch (error) {
			onError?.();
		} finally {
			closeModal();
		}
	};

	const actions = [
		{
			id: 'cancelButton',
			text: formatMessage(defaultMessages.cancel),
			onClick: onClose,
			appearance: 'subtle' as Appearance,
		},
		{
			id: 'exportButton',
			text: formatMessage(defaultMessages.export),
			onClick: startExport,
			appearance: 'primary' as Appearance,
		},
	];

	return (
		<>
			<Button onClick={openModal} testId={testId}>
				<FormattedMessage {...defaultMessages.exportButton} />
			</Button>
			<ModalTransition>
				{isModalOpen && (
					<ModalDialog width="medium" onClose={onClose}>
						<ModalHeader hasCloseButton>
							<ModalTitle>{formatMessage(defaultMessages.modalTitle)}</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<Box>
								<Text color="color.text.subtle">
									<FormattedMessage
										{...defaultMessages.modalDescription}
										values={{
											matchFilterText: (
												<Text as="strong">
													<FormattedMessage {...defaultMessages.modalDescription2} />
												</Text>
											),
										}}
									/>
								</Text>
							</Box>
							<Box paddingBlockStart="space.150">
								<Box paddingBlockEnd="space.050">
									<Heading size="xxsmall" as="div">
										<Text color="color.text.subtle">
											<FormattedMessage {...defaultMessages.exportTermsTitle} />
										</Text>
									</Heading>
								</Box>
								<Box paddingBlockEnd="space.150">
									<Checkbox
										ref={checkboxRef}
										label={
											<Text color="color.text.subtle">
												<FormattedMessage {...defaultMessages.exportTermsDescription} />
											</Text>
										}
										onChange={onCheckBoxChange}
										id="audit-log-export-terms-checkbox"
										testId="audit-log-export-terms-checkbox"
										isDisabled={isLoading}
										isChecked={isTermsChecked}
										isInvalid={hasTermsError}
										// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx
										aria-label="checkbox"
										aria-describedby={hasTermsError ? 'audit-log-export-terms-error' : undefined}
										name="audit-log-export-terms-checkbox"
										type="checkbox"
									/>
								</Box>
								{hasTermsError && (
									<div
										id="audit-log-export-terms-error"
										role="alert"
										aria-live="assertive"
										data-testid="audit-log-export-terms-error-message"
									>
										<ErrorMessage>
											<Text weight="medium">
												<FormattedMessage {...defaultMessages.exportTermsError} />
											</Text>
										</ErrorMessage>
									</div>
								)}
							</Box>
						</ModalBody>
						<ModalFooter>
							{actions.map((props, index) => (
								<Button
									key={props.id}
									{...props}
									appearance={
										index === 0 ? props.appearance || 'primary' : props.appearance || 'subtle'
									}
								>
									{props.text}
								</Button>
							))}
						</ModalFooter>
					</ModalDialog>
				)}
			</ModalTransition>
		</>
	);
};
