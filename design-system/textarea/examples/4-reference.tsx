/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { useEffect, useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import TextArea from '../src';

const wrapperStyles = css({
	maxWidth: 500,
});

export default () => {
	const ref = useRef<HTMLTextAreaElement>(null);
	useEffect(() => {
		console.log('ref:', ref);
	}, [ref]);

	return (
		<div css={wrapperStyles}>
			<label htmlFor="basic">Basic using a "ref"</label>
			<TextArea
				ref={ref}
				name="basic"
				id="basic"
				defaultValue="Lets play with ref !!"
				testId="refTestId"
			/>
		</div>
	);
};
