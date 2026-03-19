import React, { type ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

import sample from 'lodash/sample';
import nullthrows from 'nullthrows';

import ArrowDownIcon from '@atlaskit/icon/core/arrow-down';
import ArrowLeftIcon from '@atlaskit/icon/core/arrow-left';
import ArrowRightIcon from '@atlaskit/icon/core/arrow-right';
import ArrowUpIcon from '@atlaskit/icon/core/arrow-up';
import BookIcon from '@atlaskit/icon/core/book-with-bookmark';

const sampleComponents = [ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, BookIcon];

const RandomIcon = () => {
	const Icon = nullthrows(sample(sampleComponents));
	return <Icon label="Random icon" />;
};

const AnimationDemo = (): React.JSX.Element => {
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

export default AnimationDemo;
