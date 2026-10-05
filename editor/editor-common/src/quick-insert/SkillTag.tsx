import React from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	highlight: {
		backgroundColor: token('color.background.neutral'),
		boxDecorationBreak: 'clone',
		display: 'inline',
	},
	start: {
		paddingInlineStart: token('space.050'),
		paddingInlineEnd: token('space.050'),
		clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)',
	},
	end: {
		paddingInlineEnd: token('space.050'),
		clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)',
	},
	wrapping: {
		overflowWrap: 'anywhere',
		whiteSpace: 'normal',
	},
	text: {
		overflowWrap: 'anywhere',
	},
});

export type SkillTagProps = {
	isDisabled?: boolean;
	slug: string;
};

export const SkillTag = ({ slug, isDisabled = false }: SkillTagProps): React.JSX.Element => (
	<Box as="span" xcss={styles.wrapping}>
		<Text color={isDisabled ? 'color.text.disabled' : 'color.text'} xcss={styles.text}>
			<Box as="span" xcss={cx(styles.highlight, styles.start)}>
				<Text color={isDisabled ? 'color.text.disabled' : 'color.text.subtle'}>/</Text>
			</Box>
			<Box as="span" xcss={styles.highlight}>
				{slug.slice(0, -1)}
			</Box>
			{slug && (
				<Box as="span" xcss={cx(styles.highlight, styles.end)}>
					{slug.slice(-1)}
				</Box>
			)}
		</Text>
	</Box>
);
