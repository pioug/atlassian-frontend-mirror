/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@compiled/react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { ExitingPersistence, ShrinkOut } from '@atlaskit/motion';
import { token } from '@atlaskit/tokens';

import { Block, Centered } from '../utils';

const MotionShrinkOutExample = () => {
	const [actualProducts, setProducts] = useState(products);

	return (
		<div>
			<div css={containerStyles}>
				<ButtonGroup label="Products options">
					<Button onClick={() => setProducts(products)}>Reset</Button>
				</ButtonGroup>
			</div>

			<Centered css={centeredStyles}>
				<ExitingPersistence>
					{actualProducts.map((product) => (
						<ShrinkOut key={product}>
							{(props) => (
								<Block ref={props.ref} appearance="small" css={blockStyles}>
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

const products = [
	'Confluence',
	'Bitbucket',
	'Jira Service Management',
	'Opsgenie',
	'Statuspage',
	'Jira Software',
];

const containerStyles = css({ textAlign: 'center' });

const centeredStyles = css({ height: '82px' });

const blockStyles = css({
	width: 'auto',
	marginBlockEnd: token('space.050', '4px'),
	marginBlockStart: token('space.050', '4px'),
	marginInlineEnd: token('space.050', '4px'),
	marginInlineStart: token('space.050', '4px'),
	overflow: 'hidden',
});

export default MotionShrinkOutExample;
