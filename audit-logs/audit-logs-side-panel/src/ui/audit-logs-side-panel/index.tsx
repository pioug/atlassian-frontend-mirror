/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useState } from 'react';

import { jsx } from '@compiled/react';

import { Stack } from '@atlaskit/primitives/compiled';
import Tabs from '@atlaskit/tabs';

import type { AuditLogsSidePanelProps } from '../../common/types';

import { DetailsPanel } from './body/tab-panels';
import { TabListHeaders } from './header';

export const AuditLogsSidePanel = ({ event }: AuditLogsSidePanelProps) => {
	const [selectedTab, setSelectedTab] = useState(0);

	const handleTabChange = (index: number) => {
		setSelectedTab(index);
	};

	return (
		<Tabs
			id={`audit-log-side-panel-tabs-${event?.id}`}
			defaultSelected={selectedTab}
			onChange={handleTabChange}
		>
			<Stack space="space.200">
				<TabListHeaders />
				<DetailsPanel event={event} eventJSON={JSON.stringify(event)} />
			</Stack>
		</Tabs>
	);
};
