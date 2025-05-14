/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { css, jsx } from '@compiled/react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { type Direction, ExitingPersistence, SlideIn } from '@atlaskit/motion';
import { token } from '@atlaskit/tokens';

import { type Fade } from '../../src/entering/types';
import { Block, Centered, RetryContainer } from '../utils';

const MotionSlideInExample = () => {
	const [fromIndex, setFromIndex] = useState(0);
	const [fadeIndex, setFadeIndex] = useState(0);

	return (
		<RetryContainer>
			<div css={containerStyles}>
				<ButtonGroup label="Motion options">
					<Button onClick={() => setFromIndex((prev) => (prev + 1) % forms.length)}>
						From {forms[fromIndex]}
					</Button>
					<Button onClick={() => setFadeIndex((prev) => (prev + 1) % fades.length)}>
						Fade {fades[fadeIndex]}
					</Button>
				</ButtonGroup>

				<Centered css={centeredStyles}>
					<ExitingPersistence appear>
						<SlideIn enterFrom={forms[fromIndex]} fade={fades[fadeIndex]}>
							{(props) => (
								<Block
									ref={props.ref}
									// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
									className={props.className}
									css={blockStyles}
								/>
							)}
						</SlideIn>
					</ExitingPersistence>
				</Centered>
			</div>
		</RetryContainer>
	);
};

const forms: Direction[] = ['top', 'right', 'bottom', 'left'];
const fades: Fade[] = ['none', 'in', 'out', 'inout'];

const containerStyles = css({ textAlign: 'center' });

const centeredStyles = css({
	height: '300px',
	position: 'relative',
	marginBlockEnd: token('space.0'),
	marginBlockStart: token('space.0'),
	marginInlineEnd: 'auto',
	marginInlineStart: 'auto',
	overflow: 'hidden',
});

const blockStyles = css({
	width: '95%',
	height: '95%',
});

export default MotionSlideInExample;
