/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useState } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import Heading from '@atlaskit/heading';
import ChevronRightLargeIcon from '@atlaskit/icon/core/chevron-right';
import Lozenge from '@atlaskit/lozenge';
import { Box, Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		alignItems: 'center',
		border: `1px solid ${token('color.border')}`,
		borderRadius: '4px',
		overflow: 'hidden',
		paddingBlock: '0',
		paddingInline: '0.5em',
		transition: 'background 0.2s ease-in',
	},
	summary: {
		marginBlock: '0',
		marginInline: '-0.5em',
		paddingBlock: '1em',
		paddingInline: '1em',
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'center',
		'&::-webkit-details-marker': {
			display: 'none',
		},
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
		},
	},
	content: {
		paddingBlock: token('space.100'),
	},
	summaryContent: {
		display: 'inline-flex',
		alignItems: 'center',
		gap: token('space.050'),
	},
	chevron: {
		transform: 'rotate(0deg)',
		transition: 'transform 0.2s ease-out',
		alignItems: 'center',
	},
	chevronOpen: {
		transform: 'rotate(90deg)',
	},
});

/**
 * Accordion for displaying content
 */
export default function Accordion({
	description,
	appearance = 'information',
	size,
	children,
}: {
	description: string;
	appearance?: 'information' | 'warning' | 'danger' | 'success';
	size?: number;
	children: any;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const appearanceMapping = {
		information: 'inprogress',
		warning: 'moved',
		danger: 'removed',
		success: 'success',
	} as const;

	const handleToggle = (event: React.ChangeEvent<HTMLDetailsElement>) => {
		setIsOpen(event.currentTarget.open);
	};

	return (
		<Fragment>
			{children ? (
				<details onToggle={handleToggle} open={isOpen} css={styles.root}>
					<summary css={styles.summary}>
						<Box as="span" xcss={styles.summaryContent}>
							<Flex xcss={cx(styles.chevron, isOpen && styles.chevronOpen)}>
								<ChevronRightLargeIcon label={isOpen ? 'Close' : 'Open'} />
							</Flex>
							<Heading size="medium">{description}</Heading>
							{size !== undefined && (
								<Lozenge appearance={size > 0 ? appearanceMapping[appearance] : 'default'}>
									{size}
								</Lozenge>
							)}
						</Box>
					</summary>
					{isOpen && children && <Box xcss={styles.content}>{children}</Box>}
				</details>
			) : null}
		</Fragment>
	);
}
