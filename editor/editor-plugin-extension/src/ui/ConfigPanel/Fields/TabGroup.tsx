/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type { TabField, TabGroupField } from '@atlaskit/editor-common/extensions';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';

const panelWrapperStyles = css({
	flexGrow: 1,
	maxWidth: '100%',
});

type Props = {
	field: TabGroupField;
	renderPanel: (tabField: TabField) => JSX.Element;
} & WrappedComponentProps;

const TabGroupImpl = (props: Props) => {
	const { field, renderPanel } = props;
	const { fields } = field;

	const [activeTab, setActiveTab] = useState<number>(() => {
		const activeTabName = field.defaultTab || fields[0].name;
		const index = fields.findIndex((f) => f.name === activeTabName);
		return Math.max(index, 0);
	});

	const onChange = React.useCallback(
		(index: number) => {
			setActiveTab(index);
		},
		[setActiveTab],
	);

	return (
		<Tabs id={`configPanelTabs-${field.name}`} onChange={onChange} selected={activeTab}>
			<TabList>
				{fields.map(({ name, label }) => (
					<Tab key={`tab-${name}`}>{label}</Tab>
				))}
			</TabList>
			{fields.map((field) => (
				<TabPanel key={`panel-${field.name}`}>
					<div css={panelWrapperStyles}>{renderPanel(field)}</div>
				</TabPanel>
			))}
		</Tabs>
	);
};
TabGroupImpl.displayName = 'TabGroup';

const TabGroup = injectIntl(TabGroupImpl);
export default TabGroup;
