/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { type DatasourceType } from '@atlaskit/linking-types';
import { token } from '@atlaskit/tokens';

import * as AdfTable from '../../examples-helpers/adfTable.json';
import * as Image from '../../examples-helpers/images.json';
import SmartLinkClient from '../../examples-helpers/smartLinkCustomClient';
import { renderType } from '../../src/ui/issue-like-table/render-type';
import { type DatasourceTypeWithOnlyValues } from '../../src/ui/issue-like-table/types';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ContainerWrapper = styled.div({
	width: '70%',
	margin: '2em auto',
	padding: '0 1em',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const RenderDiv = styled.div({
	margin: `${token('space.075', '6px')} ${token('space.0', '0px')}`,
});

const tableHeaderStyles = css({
	width: '200px',
});

const tableRowStyles = css({
	borderBottom: '1px solid #DFE1E6',
});

interface Item {
	style?: React.CSSProperties;
	type: DatasourceType['type'];
	variations: DatasourceType['value'][][];
}

const items: Item[] = [
	{
		type: 'number',
		variations: [[123], [123.456], [-98], [-98.777]],
	},
	{
		type: 'date',
		variations: [['11/11/2023'], ['2023-04-20T23:00:00.000Z']],
	},
	{
		type: 'time',
		variations: [['11/11/2023'], ['2023-04-20T23:00:00.000Z']],
	},
	{
		type: 'datetime',
		variations: [['11/11/2023'], ['2023-04-20T23:00:00.000Z']],
	},
	{
		type: 'string',
		variations: [['Hello World']],
	},
	{
		type: 'string',
		variations: [
			['This is the first string in an array.'],
			['This is the second string in an array.'],
			['Array of strings will have line breaks.'],
		],
	},
	{
		type: 'boolean',
		variations: [[true], [false]],
	},
	{
		type: 'status',
		variations: [
			[
				{
					style: {
						appearance: 'default',
					},
					text: 'Default',
				},
			],
			[
				{
					style: {
						appearance: 'inprogress',
					},
					text: 'In Progress',
				},
			],
		],
	},
	{
		type: 'link',
		variations: [
			[
				{
					text: 'Atlassian Website',
					url: '#',
				},
			],
			[
				{
					url: 'https://app.asana.com/',
				},
			],
			[
				{
					text: 'EDM-5941',
					url: '#',
					style: {
						appearance: 'key',
					},
				},
			],
			[
				{
					url: 'https://product-fabric.atlassian.net/browse/EDM-5941',
				},
			],
			[
				{
					url: 'https://link-that-does-not-resolve.com',
				},
			],
		],
	},
	{
		type: 'icon',
		variations: [
			[
				{
					source: Image.trello,
				},
			],
		],
	},
	{
		type: 'user',
		variations: [
			[{}],
			[
				{
					avatarSource: Image.trello,
				},
			],
			[
				{
					avatarSource: Image.trello,
					displayName: 'Trello',
				},
			],
			[
				{
					avatarSource: Image.trello,
					displayName: 'Trello',
				},
				{
					avatarSource: Image.trello,
					displayName: 'Trello',
				},
				{
					avatarSource: Image.trello,
					displayName: 'Trello',
				},
				{
					avatarSource: Image.trello,
					displayName: 'Trello',
				},
				{
					avatarSource: Image.trello,
					displayName: 'Trello',
				},
			],
			[
				{
					avatarSource: Image.trello,
					displayName: 'Trello',
				},
				{
					avatarSource: Image.trello,
					displayName: 'Trello',
				},
				{
					avatarSource: Image.trello,
					displayName: 'Trello',
				},
				{
					avatarSource: Image.trello,
					displayName: 'Trello',
				},
				{
					avatarSource: Image.trello,
					displayName: 'Trello',
				},
				{
					avatarSource: Image.trello,
					displayName: 'Trello',
				},
				{
					avatarSource: Image.trello,
					displayName: 'Trello',
				},
			],
		],
	},
	{
		type: 'tag',
		variations: [
			[
				{
					text: 'Simple Tag',
				},
			],
			[
				{
					text: 'Linked & No Color',
					url: 'www.myanklehurtsxyz.com.au',
				},
			],
			[
				{
					text: 'Color & No Link',
					color: 'green',
				},
			],
			[
				{
					text: 'Color & Linked',
					color: 'green',
					url: 'www.myanklehurtsxyz.com.au',
				},
			],
		],
	},
	{
		type: 'richtext',
		style: { maxWidth: '250px' },
		variations: [
			[
				{
					type: 'adf',
					text: JSON.stringify(AdfTable.default),
				},
			],
		],
	},
];

export default () => {
	return (
		<IntlProvider locale="en">
			<SmartCardProvider client={new SmartLinkClient()}>
				<ContainerWrapper data-testid="link-datasource--render-all-types">
					<table>
						<thead>
							<tr>
								<th css={tableHeaderStyles}>Type</th>
								<th>Variations</th>
							</tr>
						</thead>

						<tbody>
							{items.map((item, index) => (
								<tr css={tableRowStyles} key={index}>
									<td>{item.type}</td>
									{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
									<td style={item.style}>
										{item.variations.map((variation, index) => (
											<RenderDiv key={index}>
												{renderType({
													type: item.type,
													values: variation,
												} as DatasourceTypeWithOnlyValues)}
											</RenderDiv>
										))}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</ContainerWrapper>
			</SmartCardProvider>
		</IntlProvider>
	);
};
