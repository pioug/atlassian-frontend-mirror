/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { css, jsx } from '@compiled/react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/default/button';
import { type Direction, type Fade } from '@atlaskit/motion/entering/types';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import SlideIn from '@atlaskit/motion/slide-in';

import { Block } from './utils/blocks';
import { Centered, RetryContainer } from './utils/containers';

const buttonContainerStyles = css({
	textAlign: 'center',
});

const centeredStyles = css({
	height: '300px',
	position: 'relative',
	marginBlockEnd: 0,
	marginBlockStart: 0,
	marginInlineEnd: 'auto',
	marginInlineStart: 'auto',
	overflow: 'hidden',
});

const blockStyles = css({
	width: '95%',
	height: '95%',
	marginBlockEnd: 'auto',
	marginBlockStart: 'auto',
	marginInlineEnd: 'auto',
	marginInlineStart: 'auto',
});

const froms: Direction[] = ['top', 'right', 'bottom', 'left'];
const fades: Fade[] = ['none', 'in', 'out', 'inout'];

export default (): JSX.Element => {
	const [isIn, setIsIn] = useState(true);
	const [fromIndex, setFromIndex] = useState(0);
	const [fadeIndex, setFadeIndex] = useState(0);

	return (
		<RetryContainer>
			<div css={buttonContainerStyles}>
				<ButtonGroup label="Motion options">
					<Button onClick={() => setIsIn((prev) => !prev)}>{isIn ? 'Exit' : 'Enter'}</Button>
					<Button onClick={() => setFromIndex((prev) => (prev + 1) % froms.length)}>
						From {froms[fromIndex]}
					</Button>
					<Button onClick={() => setFadeIndex((prev) => (prev + 1) % fades.length)}>
						Fade {fades[fadeIndex]}
					</Button>
				</ButtonGroup>

				<Centered css={centeredStyles}>
					<ExitingPersistence appear>
						{isIn && (
							<SlideIn enterFrom={froms[fromIndex]} fade={fades[fadeIndex]}>
								{(props) => (
									<Block
										ref={props.ref}
										// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
										className={props.className}
										css={blockStyles}
									/>
								)}
							</SlideIn>
						)}
					</ExitingPersistence>
				</Centered>
			</div>
		</RetryContainer>
	);
};
