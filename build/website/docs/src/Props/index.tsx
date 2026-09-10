/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import PrettyProps, { PropsTable as PT } from 'pretty-proptypes';

import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { Pressable, Text } from '@atlaskit/primitives/compiled';

import Button from '@atlaskit/button/new';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/core/chevron-up';

const styles = cssMap({
	indent: {
		paddingInlineStart: token('space.200'),
	},
	description: {
		marginTop: token('space.150'),
	},
	required: {
		fontFamily: token('font.family.code'),
		color: token('color.text.danger'),
	},
	expander: {
		cursor: 'pointer',
		paddingBlockStart: token('space.050'),
		paddingBlockEnd: token('space.050'),
		paddingInlineStart: token('space.050'),
		paddingInlineEnd: token('space.050'),
		borderRadius: token('radius.small'),
		backgroundColor: token('color.background.accent.gray.subtlest'),
		color: token('color.text'),
		transition: 'background 0.2s',
		'&:hover': {
			backgroundColor: token('color.background.accent.gray.subtlest.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.accent.gray.subtlest.pressed'),
		},
	},
	lozenge: {
		borderRadius: token('radius.small', '3px'),
		display: 'inline-block',
		paddingInlineStart: token('space.025'),
		paddingInlineEnd: token('space.025'),
		marginBlockStart: token('space.025'),
		marginBlockEnd: token('space.025'),
	},
	typeLozenge: {
		backgroundColor: token('color.background.accent.purple.subtlest'),
		color: token('color.text.accent.purple'),
	},
	typeMetaLozenge: {
		backgroundColor: token('color.background.neutral'),
		color: token('color.text.subtle'),
	},
	stringTypeLozenge: {
		backgroundColor: token('color.background.accent.green.subtlest'),
		color: token('color.text.accent.green'),
	},
});

function Indent({ children }: { children: React.ReactNode }) {
	return <div css={styles.indent}>{children}</div>;
}

function Description({ children }: { children: React.ReactNode }) {
	return typeof children === 'string' ? (
		<Text as="p">{children}</Text>
	) : (
		<div css={styles.description}>{children}</div>
	);
}

function Required({ children }: { children: React.ReactNode }) {
	return <span css={styles.required}>{children}</span>;
}

function Expander({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
	return (
		<Pressable xcss={styles.expander} onClick={onClick}>
			{children}
		</Pressable>
	);
}

function Type({ children }: { children: React.ReactNode }) {
	return <span css={[styles.lozenge, styles.typeLozenge]}>{children}</span>;
}

function TypeMeta({ children }: { children: React.ReactNode }) {
	return <span css={[styles.lozenge, styles.typeMetaLozenge]}>{children}</span>;
}

function StringType({ children }: { children: React.ReactNode }) {
	return <span css={[styles.lozenge, styles.stringTypeLozenge]}>{children}</span>;
}

function ExpandCollapseButton({
	isCollapsed,
	children,
	onClick,
}: {
	isCollapsed: boolean;
	children: React.ReactNode;
	onClick: () => void;
}) {
	return (
		<Button iconBefore={isCollapsed ? ChevronDownIcon : ChevronUpIcon} onClick={onClick}>
			{children}
		</Button>
	);
}

const components = {
	Indent,
	Description,
	Required,
	Expander,
	Type,
	TypeMeta,
	StringType,
	Button: ExpandCollapseButton,
};

export default function Props(props: Record<string, unknown>): JSX.Element {
	return <PrettyProps components={components} {...props} />;
}

export function PropsTable(props: Record<string, unknown>): JSX.Element {
	return <PT shouldCollapse components={components} {...props} />;
}
