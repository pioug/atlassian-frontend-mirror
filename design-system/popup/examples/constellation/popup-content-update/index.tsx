/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { useEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import noop from '@atlaskit/ds-lib/noop';
import Toggle from '@atlaskit/toggle';
import { token } from '@atlaskit/tokens';

import Popup from '../../../src';

import { data } from './data';

const wrapperStyles = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
});

const contentStyles = css({
	maxWidth: 350,
	padding: token('space.200', '16px'),
	textAlign: 'center',
});

const Values = ({ onUpdate }: { onUpdate: () => void }) => {
	const [textIndex, setTextIndex] = useState(0);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setTextIndex((prevIndex) => (prevIndex + 1) % data.length);
			onUpdate();
		}, 1000);

		return () => clearInterval(intervalId);
	}, [onUpdate]);

	return (
		<div css={contentStyles}>
			<h3>{data[textIndex].title}</h3>
			<p>{data[textIndex].description}</p>
		</div>
	);
};

const PopupContentUpdateExample = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isUpdateOn, setIsUpdateOn] = useState(true);

	return (
		<div css={wrapperStyles}>
			<Popup
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				content={(props) => <Values onUpdate={isUpdateOn ? props.update : noop} />}
				placement="right"
				trigger={(triggerProps) => (
					<Button
						{...triggerProps}
						appearance="primary"
						isSelected={isOpen}
						onClick={() => setIsOpen(!isOpen)}
					>
						Open popup
					</Button>
				)}
			/>
			<div>
				<p>Updates {isUpdateOn ? 'on' : 'off'}</p>
				<Toggle
					size="large"
					label="Updates toggle switch controls"
					isChecked={isUpdateOn}
					onChange={(e) => setIsUpdateOn(e.currentTarget.checked)}
				/>
			</div>
		</div>
	);
};

export default PopupContentUpdateExample;
