/** @jsx jsx */
import { useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import { ProgressIndicator } from '../../src';

const containerStyles = css({
	display: 'flex',
	padding: token('space.200', '16px'),
	alignItems: 'center',
	justifyContent: 'space-between',
	backgroundColor: token('color.text'),
});

const InvertedExample = () => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [values] = useState(['first', 'second', 'third']);

	const handlePrev = () => {
		setSelectedIndex((prevState) => prevState - 1);
	};

	const handleNext = () => {
		setSelectedIndex((prevState) => prevState + 1);
	};

	return (
		<div css={containerStyles}>
			<Button isDisabled={selectedIndex === 0} onClick={handlePrev} appearance="primary">
				Prev
			</Button>
			<ProgressIndicator appearance="inverted" selectedIndex={selectedIndex} values={values} />
			<Button
				isDisabled={selectedIndex === values.length - 1}
				onClick={handleNext}
				appearance="primary"
			>
				Next
			</Button>
		</div>
	);
};

export default InvertedExample;
