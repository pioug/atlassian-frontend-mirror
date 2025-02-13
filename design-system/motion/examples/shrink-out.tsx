/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { jsx } from '@compiled/react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import { ExitingPersistence, ShrinkOut } from '../src';

import { Block, Centered } from './utils';

const products = [
	'Confluence',
	'Bitbucket',
	'Jira Service Management',
	'Opsgenie',
	'Statuspage',
	'Jira Software',
];

export default () => {
	const [actualProducts, setProducts] = useState(products);

	return (
		<div>
			{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
			<div css={{ textAlign: 'center' }}>
				<ButtonGroup label="Products options">
					<Button onClick={() => setProducts(products)}>Reset</Button>
				</ButtonGroup>
			</div>

			<Centered css={{ height: '82px' }}>
				<ExitingPersistence>
					{actualProducts.map((product) => (
						<ShrinkOut key={product}>
							{(props) => (
								<Block
									{...props}
									appearance="small"
									css={{
										width: 'auto',
										margin: token('space.050', '4px'),
										overflow: 'hidden',
									}}
								>
									<Button
										onClick={() => {
											setProducts((prods) => prods.filter((val) => val !== product));
										}}
									>
										{product}
									</Button>
								</Block>
							)}
						</ShrinkOut>
					))}
				</ExitingPersistence>
			</Centered>
		</div>
	);
};
