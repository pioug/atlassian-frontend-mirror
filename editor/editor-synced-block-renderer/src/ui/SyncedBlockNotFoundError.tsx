import React, { useEffect, useState, type ReactNode } from 'react';

import { cssMap } from '@compiled/react';
import { useIntl, type MessageDescriptor } from 'react-intl-next';

import { IconButton } from '@atlaskit/button/new';
import commonMessages, { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { useSyncBlockActions } from '@atlaskit/editor-common/sync-block';
import CrossIcon from '@atlaskit/icon/core/cross';
import EyeOpenStrikethroughIcon from '@atlaskit/icon/core/eye-open-strikethrough';
import LinkBrokenIcon from '@atlaskit/icon/core/link-broken';
import type { NewCoreIconProps } from '@atlaskit/icon/types';
import { Anchor, Box } from '@atlaskit/primitives/compiled';
import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';

import { SyncedBlockErrorStateCard } from './SyncedBlockErrorStateCard';

type ErrorInfo = {
	description: MessageDescriptor;
	icon?: (props: NewCoreIconProps) => JSX.Element;
};

const styles = cssMap({
	link: {
		textDecoration: 'none',
	},
	spinner: {
		display: 'flex',
		justifyContent: 'center',
		paddingBlock: token('space.150'),
	},
	closeButton: {
		flex: 1,
		display: 'flex',
		justifyContent: 'flex-end',
	},
});

const errorMap: Record<string, ErrorInfo> = {
	'source-block-unsynced': {
		description: messages.sourceUnsyncedDescription,
		icon: LinkBrokenIcon,
	},
	'source-block-deleted': {
		description: messages.sourceDeletedDescription,
		icon: LinkBrokenIcon,
	},
	'source-document-deleted': {
		description: messages.notFoundDescription,
		icon: EyeOpenStrikethroughIcon,
	},
	generic: {
		description: messages.genericNotFoundDescription,
		icon: LinkBrokenIcon,
	},
};

const useErrorInfo = (reason?: string, url?: string, title?: string) => {
	const { formatMessage } = useIntl();
	if (reason === 'source-document-deleted') {
		const { icon, description } = errorMap['source-document-deleted'];
		return { description: formatMessage(description), icon };
	}

	if (!url || !title) {
		const { icon, description } = errorMap['generic'];
		return { description: formatMessage(description), icon };
	}

	const { icon, description } = errorMap[reason || 'generic'];
	return {
		description: formatMessage(description, {
			title,
			a: (chunk: ReactNode) => (
				<Anchor href={url} target="_blank" xcss={styles.link}>
					{chunk}
				</Anchor>
			),
		}),
		icon,
	};
};

export const SyncedBlockNotFoundError = ({
	reason = 'source-block-deleted',
	sourceAri,
}: {
	reason?: string;
	sourceAri?: string;
}): React.JSX.Element => {
	const { deleteSyncBlock, fetchSourceInfo } = useSyncBlockActions() ?? {};
	const [sourceInfo, setSourceInfo] = useState<{ title?: string; url?: string } | undefined>(
		undefined,
	);
	const { formatMessage } = useIntl();

	useEffect(() => {
		if (
			!sourceAri ||
			// Only fetch source info for these 2 cases
			!['source-block-deleted', 'source-block-unsynced'].includes(reason)
		) {
			setSourceInfo({});
			return;
		}

		const getSourceInfo = async () => {
			const sourceInfo = await fetchSourceInfo?.(sourceAri, true);
			setSourceInfo({ url: sourceInfo?.url, title: sourceInfo?.title });
		};

		getSourceInfo();
	}, [reason, sourceAri, fetchSourceInfo]);

	const { description, icon } = useErrorInfo(reason, sourceInfo?.url, sourceInfo?.title);

	return (
		<>
			{sourceInfo === undefined ? (
				<Box xcss={styles.spinner}>
					<Spinner />
				</Box>
			) : (
				<SyncedBlockErrorStateCard description={description} icon={icon}>
					{deleteSyncBlock && (
						<Box xcss={styles.closeButton}>
							<IconButton
								appearance="subtle"
								icon={CrossIcon}
								label={formatMessage(commonMessages.delete)}
								onClick={deleteSyncBlock}
							/>
						</Box>
					)}
				</SyncedBlockErrorStateCard>
			)}
		</>
	);
};
