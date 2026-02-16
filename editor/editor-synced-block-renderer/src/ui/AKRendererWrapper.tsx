import React, { memo, useMemo } from 'react';

import { useIntl } from 'react-intl-next';

import type { DocNode } from '@atlaskit/adf-schema';
import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import {
	ReactRenderer,
	ValidationContextProvider,
	defaultNodeComponents,
} from '@atlaskit/renderer';
import { RendererActionsContext } from '@atlaskit/renderer/actions';
import { RendererContextProvider } from '@atlaskit/renderer/renderer-context';
import Tooltip from '@atlaskit/tooltip';

import type { SyncedBlockRendererOptions } from '../types';

const ValidationContextWrapper = ({ children }: { children: React.ReactNode }) => {
	const validationContextValue = useMemo<{ allowNestedTables: boolean }>(
		() => ({ allowNestedTables: true }),
		[],
	);

	return (
		<ValidationContextProvider value={validationContextValue}>{children}</ValidationContextProvider>
	);
};

const DisabledTaskWithTooltip = <T extends keyof typeof defaultNodeComponents>({
	componentKey,
	...props
}: {
	componentKey: T;
} & React.ComponentProps<(typeof defaultNodeComponents)[T]>) => {
	const { formatMessage } = useIntl();
	const tooltipContent = formatMessage(messages.taskInDestinationSyncedBlockTooltip);

	const Component = defaultNodeComponents[componentKey];
	return (
		<Tooltip content={tooltipContent} position="auto-start">
			{/* eslint-disable-next-line react/jsx-props-no-spreading */}
			<Component {...props} disableOnChange={true} />
		</Tooltip>
	);
};

const defaultOptions: SyncedBlockRendererOptions = {
	appearance: 'full-width',
	allowAltTextOnImages: true,
	allowAnnotations: true,
	allowColumnSorting: true,
	allowCopyToClipboard: true,
	allowCustomPanels: true,
	allowPlaceholderText: true,
	allowRendererContainerStyles: true,
	allowSelectAllTrap: true,
	allowUgcScrubber: true,
	allowWrapCodeBlock: true,
	emojiResourceConfig: undefined,
	media: {
		allowLinking: true,
		allowCaptions: true,
		featureFlags: { mediaInline: true },
	},
	smartLinks: {
		ssr: true,
	},
};

export const AKRendererWrapper = memo(
	({
		doc,
		dataProviders,
		options,
	}: {
		dataProviders: ProviderFactory | undefined;
		doc: DocNode;
		options: SyncedBlockRendererOptions | undefined;
	}): React.JSX.Element => {
		const mergedOptions = { ...defaultOptions, ...options };

		const {
			appearance,
			allowAltTextOnImages,
			allowAnnotations,
			allowColumnSorting,
			allowCopyToClipboard,
			allowCustomPanels,
			allowHeadingAnchorLinks,
			allowPlaceholderText,
			allowRendererContainerStyles,
			allowSelectAllTrap,
			allowUgcScrubber,
			allowWrapCodeBlock,
			emojiResourceConfig,
			eventHandlers,
			media,
			smartLinks,
			stickyHeaders,
		} = mergedOptions ?? {};

		const nodeComponents = useMemo(() => {
			return {
				taskItem: (props: React.ComponentProps<(typeof defaultNodeComponents)['taskItem']>) => {
					// eslint-disable-next-line react/jsx-props-no-spreading
					return <DisabledTaskWithTooltip componentKey="taskItem" {...props} />;
				},
				blockTaskItem: (
					props: React.ComponentProps<(typeof defaultNodeComponents)['blockTaskItem']>,
				) => {
					// eslint-disable-next-line react/jsx-props-no-spreading
					return <DisabledTaskWithTooltip componentKey="blockTaskItem" {...props} />;
				},
			};
		}, []);

		return (
			<RendererActionsContext>
				<ValidationContextWrapper>
					<RendererContextProvider value={{ nestedRendererType: 'syncedBlock' }}>
						<div data-testid="sync-block-renderer-wrapper">
							<ReactRenderer
								appearance={appearance}
								adfStage="stage0"
								document={doc}
								disableHeadingIDs={true}
								dataProviders={dataProviders}
								nodeComponents={nodeComponents}
								allowAltTextOnImages={allowAltTextOnImages}
								allowAnnotations={allowAnnotations}
								allowColumnSorting={allowColumnSorting}
								allowCopyToClipboard={allowCopyToClipboard}
								allowCustomPanels={allowCustomPanels}
								allowHeadingAnchorLinks={allowHeadingAnchorLinks}
								allowPlaceholderText={allowPlaceholderText}
								allowRendererContainerStyles={allowRendererContainerStyles}
								allowSelectAllTrap={allowSelectAllTrap}
								allowUgcScrubber={allowUgcScrubber}
								allowWrapCodeBlock={allowWrapCodeBlock}
								emojiResourceConfig={emojiResourceConfig}
								eventHandlers={eventHandlers}
								media={media}
								smartLinks={smartLinks}
								stickyHeaders={stickyHeaders}
							/>
						</div>
					</RendererContextProvider>
				</ValidationContextWrapper>
			</RendererActionsContext>
		);
	},
);
