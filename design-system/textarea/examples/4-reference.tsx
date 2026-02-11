/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef } from 'react';

import { css, jsx } from '@compiled/react';

import TextArea from '@atlaskit/textarea';

const wrapperStyles = css({
	maxWidth: 500,
});

const _default: () => JSX.Element = () => {
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
export default _default;
