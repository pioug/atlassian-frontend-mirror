import React, { type ReactNode, type Ref, useEffect, useRef, useState } from 'react';

import { useIntl } from 'react-intl';

import CrossIcon from '@atlaskit/icon/core/cross';
import PanelRightIcon from '@atlaskit/icon/core/panel-right';
import { useFileState } from '@atlaskit/media-client-react/use-file-state';
import { useMediaClient } from '@atlaskit/media-client-react/use-media-client';
import { type FileIdentifier, type Identifier } from '@atlaskit/media-client/identifier';
import { isExternalImageIdentifier } from '@atlaskit/media-client/is-external-image-identifier';
import { type MediaTraceContext } from '@atlaskit/media-common/analytics';
import { getRandomTelemetryId } from '@atlaskit/media-common/helpers';
import { messages } from '@atlaskit/media-ui/messages';

import { DisabledToolbarDownloadButton } from './download';
import { InsetSidebarHeaderRow, RightHeader } from './styleWrappers';
import { ToolbarDownloadButton } from './ToolbarDownloadButton';
import { ViewerIconButton } from './viewer-icon-button';

type SidebarDownloadButtonProps = {
	identifier: Identifier;
	fallbackMediaNameFetcher?: (id: string) => Promise<string>;
};

// TODO: Header's download works the same way (file state, trace, fallback name). Consider
// refactoring so Header and the sidebar share one implementation.
const SidebarDownloadButton = ({
	identifier,
	fallbackMediaNameFetcher,
}: SidebarDownloadButtonProps): React.JSX.Element | null => {
	const mediaClient = useMediaClient();
	const { id, collectionName, occurrenceKey } = identifier as FileIdentifier;
	const { fileState } = useFileState(id, { collectionName, occurrenceKey });
	const traceContext = useRef<MediaTraceContext>({ traceId: getRandomTelemetryId() });
	const [fallbackMediaName, setFallbackMediaName] = useState<string | undefined>();

	const fileId = fileState && fileState.status !== 'error' ? fileState.id : undefined;
	const hasName = !!fileState && fileState.status !== 'error' && !!fileState.name;

	useEffect(() => {
		setFallbackMediaName(undefined);
		if (!fileId || hasName || !fallbackMediaNameFetcher) {
			return;
		}
		let isCancelled = false;
		fallbackMediaNameFetcher(fileId).then(
			(name) => {
				if (!isCancelled) {
					setFallbackMediaName(name);
				}
			},
			() => {
				// Silently ignore fetch failures, as the media header does.
			},
		);
		return () => {
			isCancelled = true;
		};
	}, [fileId, hasName, fallbackMediaNameFetcher]);

	if (isExternalImageIdentifier(identifier)) {
		return null;
	}
	if (!fileState || fileState.status === 'error') {
		return <DisabledToolbarDownloadButton />;
	}
	return (
		<ToolbarDownloadButton
			state={fileState}
			identifier={identifier}
			mediaClient={mediaClient}
			traceContext={traceContext.current}
			fallbackMediaName={fallbackMediaName}
		/>
	);
};

type InsetSidebarHeaderProps = {
	identifier: Identifier;
	title?: ReactNode;
	label?: string;
	onHideSidebar: () => void;
	onClose: () => void;
	hideSidebarButtonRef?: Ref<HTMLButtonElement>;
	fallbackMediaNameFetcher?: (id: string) => Promise<string>;
};

// While the sidebar is open, download, the sidebar toggle and close sit in its header.
export const InsetSidebarHeader = ({
	identifier,
	title,
	label,
	onHideSidebar,
	onClose,
	hideSidebarButtonRef,
	fallbackMediaNameFetcher,
}: InsetSidebarHeaderProps): React.JSX.Element => {
	const { formatMessage } = useIntl();
	return (
		<InsetSidebarHeaderRow title={title}>
			<RightHeader>
				<SidebarDownloadButton
					identifier={identifier}
					fallbackMediaNameFetcher={fallbackMediaNameFetcher}
				/>
				<ViewerIconButton
					testId="media-viewer-sidebar-button"
					onClick={onHideSidebar}
					buttonRef={hideSidebarButtonRef}
					isSelected
					icon={PanelRightIcon}
					label={label || formatMessage(messages.hide_sidebar)}
				/>
				<ViewerIconButton
					testId="media-viewer-close-button"
					onClick={onClose}
					icon={CrossIcon}
					label={formatMessage(messages.close)}
				/>
			</RightHeader>
		</InsetSidebarHeaderRow>
	);
};
