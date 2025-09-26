import React, { useCallback, useState } from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import Button from '@atlaskit/button/new';
import Select from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

const data = [
	<BreadcrumbsItem href="/item" key="Item" text="Item" />,
	<BreadcrumbsItem href="/item" key="Another item" text="Another item" />,
	<BreadcrumbsItem href="/item" key="A third item" text="A third item" />,
	<BreadcrumbsItem
		href="/item"
		key="A fourth item with a very long name"
		text="A fourth item with a very long name"
	/>,
	<BreadcrumbsItem href="/item" key="Yet another item" text="Yet another item" />,
	<BreadcrumbsItem href="/item" key="An item" text="An item" />,
	<BreadcrumbsItem href="/item" key="The next item" text="The next item" />,
	<BreadcrumbsItem
		href="/item"
		key="The item after the next item"
		text="The item after the next item"
	/>,
	<BreadcrumbsItem href="/item" key="The ninth item" text="The ninth item" />,
	<BreadcrumbsItem href="/item" key="Item ten" text="Item ten" />,
	<BreadcrumbsItem href="/item" key="The last item" text="The last item" />,
];

const selectOptions = new Array(11)
	.fill(undefined)
	.map((_, i) => ({ label: i.toString(), value: i }));

interface Option {
	label: string;
	value: number;
}

export default function BreadcrumbsPlaygroundExample() {
	const [isExpanded, setIsExpanded] = useState(false);
	const [itemsToShow, setItemsToShow] = useState(3);
	const [maxItems, setMaxItems] = useState<number | undefined>(undefined);
	const [itemsAfterCollapse, setItemsAfterCollapse] = useState<number | undefined>(undefined);
	const [itemsBeforeCollapse, setItemsBeforeCollapse] = useState<number | undefined>(undefined);

	const expand = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		setIsExpanded(true);
	}, []);

	return (
		<React.Fragment>
			<p>
				Some options to see how different breadcrumbs configurations work. Note that expanded
				breadcrumbs with <code>isExpanded: false</code> will not be collapsed if they are under the{' '}
				<code>maxItems</code>
			</p>
			<Button onClick={() => setIsExpanded(!isExpanded)}>
				{isExpanded ? 'Collapse' : 'Expand'} breadcrumbs
			</Button>
			<div
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					maxWidth: '200px',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					display: 'inline-block',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					padding: token('space.250', '20px'),
				}}
			>
				<label htmlFor="how-many-breadcrumbs">How many breadcrumbs to show</label>
				<Select
					inputId="how-many-breadcrumbs"
					defaultValue={selectOptions[3]}
					options={selectOptions}
					onChange={(option) => {
						if (!option) {
							return;
						}

						setItemsToShow(option.value);
					}}
				/>
			</div>
			<div
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					maxWidth: '200px',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					display: 'inline-block',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					padding: token('space.250', '20px'),
				}}
			>
				<label htmlFor="maxitems">maxItems</label>
				<Select
					inputId="maxitems"
					defaultValue={selectOptions[8]}
					options={selectOptions}
					onChange={(option) => {
						if (!option) {
							return;
						}

						setMaxItems(option.value);
					}}
				/>
			</div>
			<div
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					maxWidth: '200px',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					display: 'inline-block',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					padding: token('space.250', '20px'),
				}}
			>
				<label htmlFor="items-before-collapse">itemsBeforeCollapse</label>
				<Select
					inputId="items-before-collapse"
					defaultValue={selectOptions[1]}
					options={selectOptions}
					onChange={(option) => setItemsBeforeCollapse((option as Option).value)}
				/>
			</div>
			<div
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					maxWidth: '200px',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					display: 'inline-block',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					padding: token('space.250', '20px'),
				}}
			>
				<label htmlFor="items-after-collapse">itemsAfterCollapse</label>
				<Select
					inputId="items-after-collapse"
					defaultValue={selectOptions[1]}
					options={selectOptions}
					onChange={(option) => {
						if (!option) {
							return;
						}

						setItemsAfterCollapse(option.value);
					}}
				/>
			</div>
			<Breadcrumbs
				isExpanded={isExpanded}
				onExpand={expand}
				maxItems={maxItems}
				itemsBeforeCollapse={itemsBeforeCollapse}
				itemsAfterCollapse={itemsAfterCollapse}
			>
				{data.slice(0, itemsToShow)}
			</Breadcrumbs>
		</React.Fragment>
	);
}
