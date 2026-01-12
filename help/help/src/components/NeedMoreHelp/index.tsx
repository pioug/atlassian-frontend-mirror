import React from 'react';
import LightbulbIcon from '@atlaskit/icon/core/lightbulb';
import { Inline } from '@atlaskit/primitives/compiled';
import { useIntl } from 'react-intl-next';

import { NeedMoreHelpContainer, NeedMoreHelpContent, HelpAskAI } from './styled';
import { VIEW } from '../constants';
import { messages } from '../../messages';
import { useNavigationContext } from '../contexts/navigationContext';

interface NeedMoreHelpProps {
	label: string;
	onNeedMoreHelpClick?: () => void;
}

export const NeedMoreHelp: React.FC<NeedMoreHelpProps> = ({ onNeedMoreHelpClick, label }) => {
	const { view } = useNavigationContext();
	const { formatMessage } = useIntl();
	if (
		view === VIEW.ARTICLE ||
		view === VIEW.WHATS_NEW_ARTICLE ||
		view === VIEW.SEARCH ||
		view === VIEW.WHATS_NEW
	) {
		return null;
	}

	return (
		<NeedMoreHelpContainer>
			<Inline space="space.050" alignBlock="center" alignInline="center">
				<LightbulbIcon spacing="none" label={label} />
				<NeedMoreHelpContent>
					{formatMessage(messages.help_need_more_help_text)}
				</NeedMoreHelpContent>
				<HelpAskAI onClick={onNeedMoreHelpClick}>
					{formatMessage(messages.help_need_more_help_label)}
				</HelpAskAI>
			</Inline>
		</NeedMoreHelpContainer>
	);
};
