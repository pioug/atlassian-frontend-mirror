import React, { memo, useMemo } from 'react';

import { useIntl } from 'react-intl';

import type { DocNode } from '@atlaskit/adf-schema/doc';
import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import {
	ReactRenderer,
	ValidationContextProvider,
	defaultNodeComponents,
} from '@atlaskit/renderer';
import { RendererActionsContext } from '@atlaskit/renderer/actions/renderer-actions-context';
import { RendererContextProvider } from '@atlaskit/renderer/renderer-context';
import Tooltip from '@atlaskit/tooltip/Tooltip';

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

export const AKRendererWrapper: React.MemoExoticComponent<
	({
		doc,
		dataProviders,
		options,
		headingIdPrefix,
	}: {
		dataProviders: ProviderFactory | undefined;
		doc: DocNode;
		/**
		 * When provided, headings inside the synced block are rendered with stable
		 * ids prefixed by this value (typically the reference node's `localId`),
		 * enabling heading anchor links and Table-of-Contents deep links. When
		 * omitted, heading ids are disabled (the historical default) so unrelated
		 * consumers are unaffected.
		 */
		headingIdPrefix?: string;
		options: SyncedBlockRendererOptions | undefined;
	}) => React.JSX.Element
> = memo(
	({
		doc,
		dataProviders,
		options,
		headingIdPrefix,
	}: {
		dataProviders: ProviderFactory | undefined;
		doc: DocNode;
		headingIdPrefix?: string;
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
			mentionNodeDataProvider,
			smartLinks,
			stickyHeaders,
			contentMode,
		} = mergedOptions ?? {};

		// Only stamp heading ids when a prefix is supplied AND the consumer has
		// opted into heading anchor links. This keeps the change scoped: consumers
		// that enable ToC/anchor support (e.g. Confluence, behind its experiment)
		// pass both a per-instance prefix (the reference block's localId) and
		// `allowHeadingAnchorLinks`; every other consumer keeps id-less headings and
		// is unaffected.
		const headingIdsEnabled =
			typeof headingIdPrefix === 'string' &&
			headingIdPrefix.length > 0 &&
			Boolean(allowHeadingAnchorLinks);

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
					{/* eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed) */}
					<RendererContextProvider value={{ nestedRendererType: 'syncedBlock' }}>
						<div data-testid="sync-block-renderer-wrapper">
							<ReactRenderer
								appearance={appearance}
								adfStage="stage0"
								document={doc}
								disableHeadingIDs={!headingIdsEnabled}
								headingIdPrefix={headingIdsEnabled ? headingIdPrefix : undefined}
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
								disableTableOverflowShadow={true}
								emojiResourceConfig={emojiResourceConfig}
								eventHandlers={eventHandlers}
								media={media}
								// Synced block replica locations render through this wrapper rather than the
								// main editor/renderer surfaces, so forwarding the provider here is gated
								// independently of `platform_editor_mention_node_avatar` (which still controls
								// whether the avatar itself renders once a provider is present).
								mentionNodeDataProvider={
									isExperimentEnabled('platform_editor_mention_avatar_synced_block')
										? mentionNodeDataProvider
										: undefined
								}
								smartLinks={smartLinks}
								stickyHeaders={stickyHeaders}
								contentMode={contentMode}
							/>
						</div>
					</RendererContextProvider>
				</ValidationContextWrapper>
			</RendererActionsContext>
		);
	},
);
