import React, { memo, useMemo } from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { ReactRenderer, ValidationContextProvider } from '@atlaskit/renderer';
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

export const AKRendererWrapper = memo(
	({
		doc,
		dataProviders,
		options,
	}: {
		dataProviders: ProviderFactory | undefined;
		doc: DocNode;
		options: SyncedBlockRendererOptions | undefined;
	}) => {
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
		} = options ?? {};

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
