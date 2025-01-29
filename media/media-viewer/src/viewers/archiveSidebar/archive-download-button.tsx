import React, { useState } from 'react';
import DownloadIcon from '@atlaskit/icon/core/migration/download';
import {
	ArchiveDownloadButtonWrapper,
	DisabledArchiveDownloadButtonWrapper,
} from './styleWrappers';
import { AbuseModal } from '@atlaskit/media-ui/abuseModal';
import Tooltip from '@atlaskit/tooltip';

export type ArchiveDownloadButtonProps = {
	downloadFn: () => void;
	shouldRenderAbuseModal: boolean;
	isDisabled?: boolean;
	tooltip?: string;
};

export const ArchiveDownloadButton = ({
	downloadFn,
	shouldRenderAbuseModal,
	isDisabled,
	tooltip,
}: ArchiveDownloadButtonProps) => {
	const [isAbuseModalOpen, setIsAbuseModalOpen] = useState(false);

	const downloadOrWarn = () => {
		if (isDisabled) {
			return;
		}
		if (shouldRenderAbuseModal) {
			setIsAbuseModalOpen(true);
		} else {
			downloadFn();
		}
	};

	const icon = <DownloadIcon color="currentColor" spacing="spacious" label="Download" />;
	const downloadButton = isDisabled ? (
		<DisabledArchiveDownloadButtonWrapper>{icon}</DisabledArchiveDownloadButtonWrapper>
	) : (
		<ArchiveDownloadButtonWrapper onClick={downloadOrWarn}>{icon}</ArchiveDownloadButtonWrapper>
	);

	return (
		<>
			{shouldRenderAbuseModal && (
				<AbuseModal
					isOpen={isAbuseModalOpen}
					onConfirm={downloadFn}
					onClose={() => setIsAbuseModalOpen(false)}
				/>
			)}
			{tooltip ? (
				<Tooltip content={tooltip} position="bottom" tag="span">
					{downloadButton}
				</Tooltip>
			) : (
				downloadButton
			)}
		</>
	);
};
