/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import {
	BitbucketIcon,
	ConfluenceIcon,
	JiraServiceManagementIcon,
	JiraSoftwareIcon,
	OpsgenieIcon,
	StatuspageIcon,
} from '@atlaskit/logo';
import { token } from '@atlaskit/tokens';

import { ExitingPersistence, FadeIn, StaggeredEntrance } from '../src';

import { Block, RetryContainer } from './utils';

const logos = [
	[<BitbucketIcon size="small" />, 'Bitbucket'],
	[<ConfluenceIcon size="small" />, 'Confluence'],
	[<JiraServiceManagementIcon size="small" />, 'Jira Service Management'],
	[<JiraSoftwareIcon size="small" />, 'Jira Software'],
	[<OpsgenieIcon size="small" />, 'Opsgenie'],
	[<StatuspageIcon size="small" />, 'Statuspage'],
];

const randRemove = <T extends Array<TItem>, TItem>(arr: T) => {
	const newArr = arr.concat([]);
	newArr.splice(Date.now() % newArr.length, 1);
	return newArr;
};

export default () => {
	const [items, setItems] = useState(logos);

	return (
		<RetryContainer>
			<div
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				css={{
					textAlign: 'center',
					'> *': { marginRight: token('space.050', '4px') },
				}}
			>
				<Button onClick={() => setItems((list) => randRemove(list))}>Random remove</Button>
				<Button onClick={() => setItems(logos)}>Reset</Button>

				<ul
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
					css={{
						maxWidth: '474px',
						height: '328px',
						padding: 0,
						margin: `${token('space.200', '16px')} auto !important`,
						div: { margin: '0' },
					}}
				>
					<StaggeredEntrance>
						<ExitingPersistence appear>
							{items.map((logo) => (
								// Gotcha #1 set property keys YO
								<FadeIn key={logo[1] as string}>
									{(props) => (
										<li
											ref={props.ref}
											// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
											className={props.className}
											// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
											css={{
												display: 'block',
												padding: 0,
												margin: token('space.100', '8px'),
											}}
										>
											<Block
												css={{
													width: '100%',
													height: '48px',
													borderRadius: token('border.radius.100', '3px'),
												}}
											>
												<div
													// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
													css={{
														width: '100%',
														display: 'flex',
														alignItems: 'center',
														paddingLeft: token('space.100', '8px'),
													}}
												>
													{logo[0]}
													<h3
														// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
														css={{
															margin: 0,
															fontWeight: 300,
															marginLeft: token('space.100', '8px'),
														}}
													>
														{logo[1]}
													</h3>
												</div>
											</Block>
										</li>
									)}
								</FadeIn>
							))}
						</ExitingPersistence>
					</StaggeredEntrance>
				</ul>
			</div>
		</RetryContainer>
	);
};
