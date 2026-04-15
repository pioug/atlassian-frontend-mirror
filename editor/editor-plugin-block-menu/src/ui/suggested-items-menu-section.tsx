import React from 'react';

import { useIntl } from 'react-intl-next';

import { blockMenuMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';

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
