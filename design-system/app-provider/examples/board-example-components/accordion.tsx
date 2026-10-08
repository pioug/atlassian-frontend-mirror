/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag Fragment
 */

import { type JSX, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap, cx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/core/chevron-up';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Pressable } from '@atlaskit/primitives/compiled/pressable';
import { token } from '@atlaskit/tokens';

const accordionStyles = cssMap({
	container: {
		border: `${token('border.width')} solid ${token('color.border')}`,
		borderRadius: token('radius.small'),
		overflow: 'hidden',
	},
	header: {
		width: '100%',
		paddingBlockStart: token('space.150'),
		paddingInlineEnd: token('space.150'),
		paddingBlockEnd: token('space.150'),
		paddingInlineStart: token('space.150'),
		cursor: 'pointer',
		backgroundColor: 'transparent',
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
	},
	headerDisabled: {
		cursor: 'not-allowed',
		opacity: token('opacity.disabled'),
		backgroundColor: token('color.background.neutral.subtle'),
		'&:hover': {
			// @ts-expect-error - token values are valid
			backgroundColor: 'transparent',
		},
		'&:active': {
			// @ts-expect-error - token values are valid
			backgroundColor: 'transparent',
		},
	},
	chevronContainer: {
		marginInlineStart: token('space.200'),
	},
	content: {
		paddingBlockStart: token('space.300'),
		paddingInlineEnd: token('space.150'),
		paddingBlockEnd: token('space.150'),
		paddingInlineStart: token('space.150'),
		borderBlockStart: `${token('border.width')} solid ${token('color.border')}`,
	},
});

export interface AccordionProps {
	title: string;
	children: React.ReactNode;
	isDefaultExpanded?: boolean;
	isDisabled?: boolean;
	onExpandedChange?: (expanded: boolean) => void;
}

export const Accordion = ({
	title,
	children,
	isDefaultExpanded = false,
	isDisabled = false,
	onExpandedChange,
}: AccordionProps): JSX.Element => {
	const [isExpanded, setIsExpanded] = useState(isDefaultExpanded);

	const handleToggle = () => {
		if (!isDisabled) {
			const newExpanded = !isExpanded;
			setIsExpanded(newExpanded);
			onExpandedChange?.(newExpanded);
		}
	};

	return (
		<Box xcss={accordionStyles.container}>
			<Pressable
				onClick={handleToggle}
				xcss={cx(accordionStyles.header, isDisabled && accordionStyles.headerDisabled)}
				isDisabled={isDisabled}
				aria-disabled={isDisabled}
			>
				<Inline spread="space-between" alignBlock="center">
					<Heading as="h4" size="small">
						{title}
					</Heading>
					<Box xcss={accordionStyles.chevronContainer}>
						{isExpanded ? (
							<ChevronUpIcon label="Collapse" size="small" />
						) : (
							<ChevronDownIcon label="Expand" size="small" />
						)}
					</Box>
				</Inline>
			</Pressable>
			{isExpanded && !isDisabled && <Box xcss={accordionStyles.content}>{children}</Box>}
		</Box>
	);
};
