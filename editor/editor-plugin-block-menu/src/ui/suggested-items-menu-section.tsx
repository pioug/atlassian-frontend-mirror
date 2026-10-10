import React from 'react';

import { useIntl } from 'react-intl';

import { messages as blockMenuMessages } from '@atlaskit/editor-common/messages/block-menu';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar/toolbar-dropdown-item-section';

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

export const SuggestedItemsMenuSection: React.NamedExoticComponent<SuggestedItemsMenuSectionProps> =
	React.memo<SuggestedItemsMenuSectionProps>(({ api, children }) => {
		const suggestedItems = useSuggestedItems(api);
		const { formatMessage } = useIntl();

		if (suggestedItems.length === 0) {
			return null;
		}

		const hasSeparator = hasCreateSectionContent(api) || hasStructureSectionContent(api);

		return (
			<ToolbarDropdownItemSection
				title={formatMessage(blockMenuMessages.suggested)}
				hasSeparator={hasSeparator}
			>
				{children}
			</ToolbarDropdownItemSection>
		);
	});
