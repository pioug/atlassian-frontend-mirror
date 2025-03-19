/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useState } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import Select from '@atlaskit/select';
import Table, { Cell, HeadCell, Row, TBody, THead } from '@atlaskit/table';

import { rows } from './utils/all-components';

const wrapperStyles = cssMap({
	root: {
		width: '600px',
		position: 'relative',
		zIndex: 0,
	},
});

const selectOptions = [
	{ label: 'Brand', value: 'brand' },
	{ label: 'Legacy', value: 'legacy' },
] as const;

const appOrder = [
	'Jira',
	'Confluence',
	'Loom',
	'Rovo',
	'Focus',
	'Align',
	'Talent',
	'Bitbucket',
	'Compass',
	'Statuspage',
	'Jira Service Management',
	'Assets',
	'Opsgenie',
	'Jira Product Discovery',
	'Jira Customer Service',
	'Trello',
	'Guard',
	'Guard Detect',
	'Home',
	'Company Hub',
	'Projects',
	'Goals',
	'Teams',
	'Chat',
	'Search',
	'Studio',
	'Analytics',
	'Admin',
	'More Atlassian Apps',
	'Custom Link',
];

export default function ShowcaseExample({
	appearance: providedAppearance = 'brand',
}: {
	appearance?: 'brand' | 'legacy';
}) {
	const [appearance, setAppearance] = useState<'brand' | 'legacy'>(providedAppearance);

	return (
		<Fragment>
			<label htmlFor="appearance">Appearance</label>
			<Select<(typeof selectOptions)[number]>
				inputId="appearance"
				options={selectOptions}
				defaultOption={selectOptions[0]}
				onChange={(newValue) => setAppearance(newValue?.value ?? 'brand')}
			/>
			<div css={wrapperStyles.root}>
				<Table>
					<THead>
						<HeadCell>App</HeadCell>
						<HeadCell>20x20</HeadCell>
						<HeadCell>24x24</HeadCell>
						<HeadCell>32x32</HeadCell>
						<HeadCell>Wordmark</HeadCell>
					</THead>
					<TBody>
						{/* Order rows based on appOrder */}
						{rows
							.sort(
								(a: (typeof rows)[0], b: (typeof rows)[0]) =>
									appOrder.indexOf(a.name) - appOrder.indexOf(b.name),
							)
							.map(({ name, Icon20, Icon24, Icon32, Logo }) => (
								<Row key={name}>
									<Cell>{name}</Cell>
									<Cell>{<Icon20 appearance={appearance} />}</Cell>
									<Cell>{<Icon24 appearance={appearance} />}</Cell>
									<Cell>{<Icon32 appearance={appearance} />}</Cell>
									<Cell>{Logo === null ? 'N/A' : <Logo />}</Cell>
								</Row>
							))}
					</TBody>
				</Table>
			</div>
		</Fragment>
	);
}
