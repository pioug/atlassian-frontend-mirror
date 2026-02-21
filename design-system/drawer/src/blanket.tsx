/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import AkBlanket from '@atlaskit/blanket';
import { cssMap, jsx } from '@atlaskit/css';
import { ExitingPersistence, FadeIn } from '@atlaskit/motion';

type BlanketProps = {
	isOpen: boolean;
	onBlanketClicked: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	testId?: string;
};

const styles = cssMap({
	blanket: {
		position: 'relative',
	},
});

/**
 * A wrapper around `@atlaskit/blanket` that adds a fade in/out transition.
 */
const Blanket: ({ isOpen, onBlanketClicked, testId }: BlanketProps) => JSX.Element = ({
	isOpen,
	onBlanketClicked,
	testId,
}: BlanketProps) => {
	return (
		<ExitingPersistence appear>
			{isOpen && (
				<FadeIn
					/*
					 * The fade out animation uses half the passed duration so it evens out.
					 */
					duration="large"
					/**
					 * We don't expose this on `FadeIn` but it does get passed down.
					 * TODO: figure out how we want to handle this...
					 */
					// @ts-ignore
					animationTimingFunction="ease-out"
				>
					{({ className }) => (
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						<div css={styles.blanket} className={className}>
							<AkBlanket isTinted onBlanketClicked={onBlanketClicked} testId={testId && testId} />
						</div>
					)}
				</FadeIn>
			)}
		</ExitingPersistence>
	);
};

export default Blanket;
