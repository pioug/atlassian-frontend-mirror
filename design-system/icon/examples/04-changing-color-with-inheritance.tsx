/** @jsx jsx */
import { useState } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import BookIcon from '../glyph/book';
import ArrowUpIcon from '../glyph/arrow-up';
import ArrowDownIcon from '../glyph/arrow-down';
import ArrowLeftIcon from '../glyph/arrow-left';
import ArrowRightIcon from '../glyph/arrow-right';

const containerStyles = css({
	display: 'flex',
	height: '100%',
	alignItems: 'center',
	justifyContent: 'center',
	flexWrap: 'wrap',
	transition: 'color 0.2s, background-color 0.2s',
});

const textStyles = css({
	flexBasis: '100%',
	textAlign: 'center',
});

const ChangingColorWithInheritance = () => {
	const [isColorFlipped, setIsColorFlipped] = useState(false);

	return (
		<div
			css={containerStyles}
			style={{
				backgroundColor: isColorFlipped ? 'white' : token('color.background.brand.bold'),
				color: isColorFlipped ? token('color.text') : token('color.text.inverse'),
			}}
		>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<p css={textStyles} style={{ backgroundColor: 'inherit' }}>
				Icons inherit color from their parent by default.
			</p>
			<BookIcon size="xlarge" label="book" />
			<ArrowUpIcon size="xlarge" label="arrowup" />
			<ArrowDownIcon size="xlarge" label="arrowdown" />
			<ArrowLeftIcon size="xlarge" label="arrowleft" />
			<ArrowRightIcon size="xlarge" label="arrowright" />
			<p css={textStyles} style={{ backgroundColor: isColorFlipped ? 'inherit' : 'white' }}>
				<Button appearance="subtle" onClick={() => setIsColorFlipped(!isColorFlipped)}>
					Change colour
				</Button>
			</p>
		</div>
	);
};

export default ChangingColorWithInheritance;
