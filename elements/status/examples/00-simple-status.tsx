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

export default () => (
	<div css={containerStyles} id="container">
		<StatusInParagraph text="Unavailable" color="neutral" />
		<StatusInParagraph text="New" color="purple" />
		<StatusInParagraph text="In progress" color="blue" />
		<StatusInParagraph text="Blocked" color="red" />
		<StatusInParagraph text="On hold" color="yellow" />
		<StatusInParagraph text="Done" color="green" />
	</div>
);
