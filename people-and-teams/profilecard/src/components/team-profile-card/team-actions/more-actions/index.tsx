import React, { useCallback, useState } from 'react';

import { useIntl } from 'react-intl-next';

import { IconButton } from '@atlaskit/button/new';
import MoreIcon from '@atlaskit/icon/core/migration/show-more-horizontal--more';
import { MenuGroup, Section } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';
import { Box } from '@atlaskit/primitives';

import { messages } from './messages';

export type ActionItem = {
	id: string;
	item: React.ReactNode;
};

type MoreActionsProps = {
	actions: ActionItem[];
	loading?: boolean;
};

export const MoreActions = ({ actions, loading }: MoreActionsProps) => {
	const { formatMessage } = useIntl();
	const [isOpen, setOpen] = useState(false);

	const onMoreClick = useCallback((shouldBeOpen: boolean) => {
		setOpen(shouldBeOpen);
	}, []);

	return (
		<Popup
			isOpen={isOpen}
			onClose={() => setOpen(false)}
			content={() => (
				<MenuGroup spacing="cozy">
					<Section>
						{actions.map((action) => (
							<Box key={action.id}>{action.item}</Box>
						))}
					</Section>
				</MenuGroup>
			)}
			trigger={(triggerProps) => (
				<IconButton
					{...triggerProps}
					icon={MoreIcon}
					label={formatMessage(messages.showMoreIconLabel)}
					onClick={() => onMoreClick(!isOpen)}
					isSelected={isOpen}
					isLoading={loading}
				/>
			)}
			placement="right-start"
			shouldRenderToParent={false}
		/>
	);
};
