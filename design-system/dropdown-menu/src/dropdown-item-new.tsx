/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	forwardRef,
	type ForwardRefExoticComponent,
	Fragment,
	memo,
	type MemoExoticComponent,
	type Ref,
	type RefAttributes,
	useContext,
} from 'react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import CheckMarkIcon from '@atlaskit/icon/core/check-mark';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Anchor } from '@atlaskit/primitives/compiled/anchor';
import { Pressable } from '@atlaskit/primitives/compiled/pressable';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

import KeyboardShortcut from './internal/components/keyboard-shortcut';
import { DropdownTriggerContext } from './internal/context/dropdown-trigger-context';
import { NewSpacingContext } from './internal/context/spacing-context';
import type { NewDropdownMenuItemProps } from './types';

const styles = cssMap({
	root: {
		display: 'flex',
		flexDirection: 'row',
		columnGap: token('space.150'),
		alignItems: 'center',
		justifyContent: 'space-between',
		flexGrow: 1,
		border: 'none',
		outline: 0,
		textDecoration: 'none',
		backgroundColor: token('color.background.neutral.subtle'),
		margin: '0',
		paddingInline: token('space.150'),
		paddingBlock: token('space.100'),
		textAlign: 'start',
		borderRadius: token('radius.medium'),
		color: token('color.text.subtle'),
		width: '100%',
		position: 'relative',

		'&:focus': {
			outlineColor: token('color.border.focused'),
			outlineOffset: token('space.negative.025'),
			outlineStyle: 'solid',
			outlineWidth: token('border.width.focused'),
			color: token('color.text.subtle'),
		},
		'&:focus-visible': {
			outlineColor: token('color.border.focused'),
			outlineOffset: token('space.negative.025'),
			outlineStyle: 'solid',
			outlineWidth: token('border.width.focused'),
		},
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
			textDecoration: 'none',
			color: token('color.text.subtle'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
		},
	},
	compact: {
		columnGap: token('space.100'),
		paddingInline: token('space.100'),
		paddingBlock: token('space.075'),
	},
	beforeAfterElement: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		minWidth: '16px',
		minHeight: '16px',
		flexShrink: 0,
	},
	textContainer: {
		paddingInlineEnd: token('space.150'),
	},
	selected: {
		backgroundColor: token('color.background.selected'),
		color: token('color.text'),
		'&:hover': {
			backgroundColor: token('color.background.selected.hovered'),
			color: token('color.text'),
		},
		'&:focus': {
			color: token('color.text'),
		},
		'&:active': {
			backgroundColor: token('color.background.selected.pressed'),
		},
	},
	disabled: {
		cursor: 'not-allowed',
		color: token('color.text.disabled'),
		'&:hover': {
			/* @ts-expect-error Complaining about not using a hover token */
			backgroundColor: token('color.background.neutral.subtle'),
			color: token('color.text.disabled'),
		},
		'&:active': {
			/* @ts-expect-error Complaining about not using a pressed token */
			backgroundColor: token('color.background.neutral.subtle'),
		},
	},
	disabledAndSelected: {
		cursor: 'not-allowed',
		color: token('color.text.disabled'),
		backgroundColor: token('color.background.selected'),
		'&:hover': {
			/* @ts-expect-error Complaining about not using a hover token */
			backgroundColor: token('color.background.selected'),
			color: token('color.text.disabled'),
		},
		'&:active': {
			/* @ts-expect-error Complaining about not using a pressed token */
			backgroundColor: token('color.background.selected'),
		},
	},
	danger: {
		color: token('color.text.danger'),
		'&:hover': {
			color: token('color.text.danger'),
		},
		'&:focus': {
			color: token('color.text.danger'),
		},
	},
});

function getTitleColor({
	isLink,
	isDisabled,
	isSelected,
	isDanger,
}: {
	isLink?: boolean;
	isDisabled?: boolean;
	isSelected?: boolean;
	isDanger?: boolean;
}) {
	if (isLink) {
		return isSelected ? 'color.text' : 'color.text.subtle';
	}
	if (isDisabled) {
		return 'color.text.disabled';
	}
	if (isSelected) {
		return 'color.text';
	}
	if (isDanger) {
		return 'color.text.danger';
	}
	return 'color.text.subtle';
}

function getDescriptionColor({ isLink, isDisabled }: { isLink?: boolean; isDisabled?: boolean }) {
	if (isLink || !isDisabled) {
		return 'color.text.subtlest';
	}
	return 'color.text.disabled';
}

const NewDropdownMenuItem: MemoExoticComponent<
	ForwardRefExoticComponent<
		NewDropdownMenuItemProps & RefAttributes<HTMLButtonElement | HTMLAnchorElement>
	>
> = memo(
	forwardRef<HTMLButtonElement | HTMLAnchorElement, NewDropdownMenuItemProps>(
		(
			{
				title,
				description,
				elemBefore,
				elemAfter,
				shouldTitleWrap,
				shouldDescriptionWrap,
				isSelected,
				isDisabled,
				hasNestedMenu: hasNestedMenuProp,
				shortcut,
				appearance,
				href,
				onClick,
				target,
				rel,
				testId,
				id,
				role = 'menuitem',
				'aria-checked': ariaChecked,
				'aria-haspopup': ariaHasPopup,
				'aria-expanded': ariaExpanded,
			}: NewDropdownMenuItemProps,
			ref,
		): JSX.Element => {
			const isDropdownTrigger = useContext(DropdownTriggerContext);
			const hasNestedMenu = isDropdownTrigger || hasNestedMenuProp;
			const spacing = useContext(NewSpacingContext);
			const isCompact = spacing === 'compact';

			const isLink = !!href;
			const isDanger = appearance === 'danger';
			const titleMaxLines = shouldTitleWrap ? undefined : 1;
			const descMaxLines = shouldDescriptionWrap ? undefined : 1;

			const titleColor = getTitleColor({ isLink, isDisabled, isSelected, isDanger });
			const descColor = getDescriptionColor({ isLink, isDisabled });

			// Just to force the toggle in atlaspack workbench
			// @ts-ignore
			const _nothing = fg('platform-dst-tokens-finesse');

			const menuItem = (
				<Fragment>
					{elemBefore && (
						<span css={styles.beforeAfterElement} data-testid={testId && `${testId}--elem-before`}>
							{elemBefore}
						</span>
					)}
					<Stack grow="fill" space="space.025" xcss={styles.textContainer}>
						<Text
							weight="medium"
							color={titleColor}
							maxLines={titleMaxLines}
							testId={testId && `${testId}--title`}
						>
							{title}
						</Text>
						{description && (
							<Text
								color={descColor}
								maxLines={descMaxLines}
								testId={testId && `${testId}--description`}
							>
								{description}
							</Text>
						)}
					</Stack>
					{shortcut && <KeyboardShortcut shortcut={shortcut} />}
					{elemAfter && (
						<span css={styles.beforeAfterElement} data-testid={testId && `${testId}--elem-after`}>
							{elemAfter}
						</span>
					)}
					{hasNestedMenu && (
						<span css={styles.beforeAfterElement} data-testid={testId && `${testId}--chevron`}>
							<ChevronRightIcon size="small" label="" />
						</span>
					)}
					{isSelected && role === 'menuitem' && !hasNestedMenu && (
						<span css={styles.beforeAfterElement} data-testid={testId && `${testId}--selected`}>
							<CheckMarkIcon label="" />
						</span>
					)}
				</Fragment>
			);

			if (href) {
				return (
					<Anchor
						href={href}
						target={target}
						rel={rel}
						onClick={onClick}
						xcss={cx(
							styles.root,
							isCompact && styles.compact,
							isSelected && styles.selected,
							isDanger && styles.danger,
						)}
						testId={testId}
						role={role}
						id={id}
						ref={ref as Ref<HTMLAnchorElement>}
						aria-current={isSelected ? 'page' : undefined}
					>
						{menuItem}
					</Anchor>
				);
			}
			return (
				<Pressable
					onClick={onClick}
					isDisabled={isDisabled}
					xcss={cx(
						styles.root,
						isCompact && styles.compact,
						isSelected && styles.selected,
						isDisabled && styles.disabled,
						isSelected && isDisabled && styles.disabledAndSelected,
						isDanger && styles.danger,
					)}
					testId={testId}
					role={role}
					aria-checked={ariaChecked}
					aria-haspopup={ariaHasPopup}
					aria-expanded={ariaExpanded}
					id={id}
					ref={ref as Ref<HTMLButtonElement>}
				>
					{menuItem}
				</Pressable>
			);
		},
	),
);

export default NewDropdownMenuItem;
