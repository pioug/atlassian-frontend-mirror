import React from 'react';
import { Status, type Color } from '../src/element';
import { Box } from '@atlaskit/primitives/compiled';
import { cssMap } from '@atlaskit/css';

const styles = cssMap({
	containerStyles: {
		width: '140px',
	},
});

const StatusInParagraph = ({ text, color }: { color: Color; text: string }) => (
	<p>
		<Status text={text} color={color} isBold />
	</p>
);

export default () => (
	<Box xcss={styles.containerStyles} id="container">
		<StatusInParagraph text="Unavailable" color="neutral" />
		<StatusInParagraph text="New" color="purple" />
		<StatusInParagraph text="In progress" color="blue" />
		<StatusInParagraph text="Blocked" color="red" />
		<StatusInParagraph text="On hold" color="yellow" />
		<StatusInParagraph text="Done" color="green" />
	</Box>
);
