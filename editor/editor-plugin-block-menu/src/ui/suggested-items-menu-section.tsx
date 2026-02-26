import React from 'react';

import { useIntl } from 'react-intl-next';

import { blockMenuMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';
import { fg } from '@atlaskit/platform-feature-flags';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

import { useSuggestedItems } from './hooks/useSuggestedItems';
import {
	hasCreateSectionContent,
	hasStructureSectionContent,
} from './utils/checkHasPreviousSectionContent';

type SuggestedItemsMenuSectionProps = {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	children?: React.ReactNode;
};

export const SuggestedItemsMenuSection = React.memo<SuggestedItemsMenuSectionProps>(
	({ api, children }) => {
		const suggestedItems = useSuggestedItems(api);
		const { formatMessage } = useIntl();

		if (suggestedItems.length === 0) {
			return null;
		}

		// [FEATURE FLAG: platform_editor_block_menu_v2_patch_3]
		// Conditionally show separator based on whether there's content after this section.
		// Old behavior: always show separator (true).
		// To clean up: remove conditional, keep only the hasCreateSectionContent || hasStructureSectionContent logic.
		const hasSeparator = fg('platform_editor_block_menu_v2_patch_3')
			? hasCreateSectionContent(api) || hasStructureSectionContent(api)
			: true;

		return (
			<ToolbarDropdownItemSection
				title={formatMessage(blockMenuMessages.suggested)}
				hasSeparator={hasSeparator}
			>
				{children}
			</ToolbarDropdownItemSection>
		);
	},
);
