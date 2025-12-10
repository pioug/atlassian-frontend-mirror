import React, { memo, useMemo } from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import {
	ReactRenderer,
	ValidationContextProvider,
	defaultNodeComponents,
} from '@atlaskit/renderer';
import { RendererActionsContext } from '@atlaskit/renderer/actions';

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

const defaultOptions: SyncedBlockRendererOptions = {
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
	smartLinks: undefined,
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
			media,
			smartLinks,
			stickyHeaders,
		} = mergedOptions ?? {};

		const nodeComponents = useMemo(() => {
			return {
				taskItem: (props: React.ComponentProps<(typeof defaultNodeComponents)['taskItem']>) => {
					const TaskItem = defaultNodeComponents['taskItem'];
					// eslint-disable-next-line react/jsx-props-no-spreading
					return <TaskItem {...props} disabled={true} />;
				},
				blockTaskItem: (
					props: React.ComponentProps<(typeof defaultNodeComponents)['blockTaskItem']>,
				) => {
					const BlockTaskItem = defaultNodeComponents['blockTaskItem'];
					// eslint-disable-next-line react/jsx-props-no-spreading
					return <BlockTaskItem {...props} disabled={true} />;
				},
			};
		}, []);

		return (
			<RendererActionsContext>
				<ValidationContextWrapper>
					<div data-testid="sync-block-renderer-wrapper">
						<ReactRenderer
							appearance="full-width"
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
							media={media}
							smartLinks={smartLinks}
							stickyHeaders={stickyHeaders}
						/>
					</div>
				</ValidationContextWrapper>
			</RendererActionsContext>
		);
	},
);
