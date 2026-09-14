/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Status, type Color } from '../src/element';
import { css, jsx } from '@compiled/react';

const containerStyles = css({
	width: '140px',
});

const StatusInParagraph = ({ text, color }: { color: Color; text: string }) => (
	<p>
		<Status text={text} color={color} />
	</p>
);

export default (): JSX.Element => (
	<div css={containerStyles} id="container">
		<StatusInParagraph text="Teal" color="#b3f5ff" />
		<StatusInParagraph text="Green" color="#ABF5D1" />
		<StatusInParagraph text="Lime" color="#D3F1A7" />
		<StatusInParagraph text="Yellow" color="#FFF0B3" />
		<StatusInParagraph text="Orange" color="#FCE4A6" />
		<StatusInParagraph text="Magenta" color="#fdd0ec" />
	</div>
);
