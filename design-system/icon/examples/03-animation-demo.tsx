import React, { type ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

import sample from 'lodash/sample';
import nullthrows from 'nullthrows';

import ArrowDownIcon from '../glyph/arrow-down';
import ArrowLeftIcon from '../glyph/arrow-left';
import ArrowRightIcon from '../glyph/arrow-right';
import ArrowUpIcon from '../glyph/arrow-up';
import BookIcon from '../glyph/book';

const sampleComponents = [ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, BookIcon];

const RandomIcon = () => {
	const Icon = nullthrows(sample(sampleComponents));
	return <Icon label="Random icon" />;
};

const AnimationDemo = () => {
	const [timerId, setTimerId] = useState<number>();
	const [, setUpdateCount] = useState(0);
	const checkboxRef = useRef<HTMLInputElement>(null);

	const startAnimating = useCallback(() => {
		setTimerId(window.setInterval(() => setUpdateCount((count) => count + 1), 3000));
	}, [setTimerId, setUpdateCount]);

	useEffect(() => {
		return () => {
			clearInterval(timerId);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [startAnimating]);

	const toggleAnimation = (e: ChangeEvent) => {
		if ((e.target as HTMLInputElement).checked) {
			startAnimating();
		} else {
			clearInterval(timerId);
		}
	};

	return (
		<div>
			<label htmlFor="animate">
				<input type="checkbox" id="animate" onChange={toggleAnimation} ref={checkboxRef} /> Animate
				(every 3 seconds)
			</label>
			<hr role="presentation" />
			<div>
				<RandomIcon />
				<RandomIcon />
				<RandomIcon />
				<RandomIcon />
				<RandomIcon />
				<RandomIcon />
				<RandomIcon />
				<RandomIcon />
			</div>
		</div>
	);
};

AnimationDemo.displayName = 'AnimationDemo';

export default AnimationDemo;
