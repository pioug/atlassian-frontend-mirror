import React, { useRef, useState } from 'react';

import { parse } from 'query-string';
import { FormattedMessage, useIntl } from 'react-intl-next';
import { v4 as uuidv4 } from 'uuid';

import Button, { type Appearance } from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import Flag, { FlagGroup } from '@atlaskit/flag';
import { ErrorMessage } from '@atlaskit/form';
import Heading from '@atlaskit/heading';
import SuccessIcon from '@atlaskit/icon/core/migration/status-success--check-circle';
import WarningIcon from '@atlaskit/icon/core/migration/status-warning--warning';
import ModalDialog, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { defaultMessages } from './messages';

export interface AuditLogExportButtonProps {
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
	/** Organization ID for the export */
	orgId: string;
	/** Search parameters as a string (e.g., "?from=2023-01-01&to=2023-12-31") */
	search?: string;
	/** Optional test ID for the export button */
	testId?: string;
}

export const AuditLogExportButton = ({
	onExport,
	orgId,
	search = '',
	testId = 'audit-log-export-button',
}: AuditLogExportButtonProps) => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [flagId] = useState<string>(uuidv4());
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isTermsChecked, setIsTermsChecked] = useState<boolean>(false);
	const [hasTermsError, setHasTermsError] = useState<boolean>(false);
	const [flags, setFlags] = useState<Array<{ id: string; type: 'success' | 'error' }>>([]);
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

	const addFlag = (type: 'success' | 'error') => {
		const newFlag = { id: flagId, type };
		setFlags((prevFlags) => [newFlag, ...prevFlags]);
	};

	const handleFlagDismiss = () => {
		setFlags((prevFlags) => prevFlags.slice(1));
	};

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsLoading(false);
		setIsModalOpen(false);
		setIsTermsChecked(false);
		setHasTermsError(false);
		// Do not reset flags here; they should be controlled by the flag's auto-dismiss or user action
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

			addFlag('success');
		} catch (error) {
			addFlag('error');
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
						<ModalHeader>
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
			<FlagGroup onDismissed={handleFlagDismiss} shouldRenderToParent>
				{flags.map((flag) => {
					if (flag.type === 'success') {
						return (
							<Flag
								key={flag.id}
								id={flag.id}
								icon={
									<SuccessIcon
										label="Success"
										spacing="spacious"
										color={token('color.icon.success')}
									/>
								}
								title={formatMessage(defaultMessages.successFlagTitle)}
								description={formatMessage(defaultMessages.successFlagDescription)}
							/>
						);
					} else {
						return (
							<Flag
								key={flag.id}
								id={flag.id}
								icon={
									<WarningIcon
										label="Warning"
										spacing="spacious"
										color={token('color.icon.warning')}
									/>
								}
								title={formatMessage(defaultMessages.errorFlagTitle)}
								description={formatMessage(defaultMessages.errorFlagDescription)}
							/>
						);
					}
				})}
			</FlagGroup>
		</>
	);
};
