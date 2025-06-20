/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import EmojiCustomIcon from '@atlaskit/icon/glyph/emoji/custom';
import StarIcon from '@atlaskit/icon/glyph/star';
import {
	ButtonItem,
	CustomItem,
	type CustomItemComponentProps,
	HeadingItem,
	LinkItem,
	Section,
	SkeletonHeadingItem,
	SkeletonItem,
} from '@atlaskit/menu';
import { token } from '@atlaskit/tokens';

const overrideStyles = css({
	paddingBlockEnd: token('space.150', '12px'),
	paddingBlockStart: token('space.150', '12px'),
	paddingInlineEnd: token('space.250', '20px'),
	paddingInlineStart: token('space.250', '20px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/design-system/no-nested-styles
	'[data-item-elem-after]': {
		opacity: 0,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&:hover [data-item-elem-after]': {
		opacity: 1,
	},
});

// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
const Emphasis = (props: CustomItemComponentProps) => <em {...props} />;
const Star = <StarIcon label="" />;

const ItemVariants = () => {
	return (
		<div
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				display: 'flex',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				flexDirection: 'column',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				maxWidth: 500,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				margin: '0 auto',
			}}
		>
			<HeadingItem testId="heading-item">This is a heading Item</HeadingItem>
			<ButtonItem testId="item-button">Regular Item</ButtonItem>
			<ButtonItem
				testId="item-button-at-scale"
				description="The long title is intended to provide a summarised description of the purpose or scope of the instrument."
			>
				The long title (properly, the title in some jurisdictions) is the formal title appearing at
				the head of a statute (such as an act of Parliament or of Congress) or other legislative
				instrument.
			</ButtonItem>
			<ButtonItem
				iconBefore={<StarIcon label="" />}
				iconAfter={<StarIcon label="" />}
				testId="item-button-at-scale-before-after"
				description="The long title is intended to provide a summarised description of the purpose or scope of the instrument."
			>
				The long title (properly, the title in some jurisdictions) is the formal title appearing at
				the head of a statute (such as an act of Parliament or of Congress) or other legislative
				instrument.
			</ButtonItem>
			<ButtonItem
				testId="item-button-at-scale-multiple-line-title"
				shouldTitleWrap
				description="The long title is intended to provide a summarised description of the purpose or scope of the instrument."
			>
				The long title (properly, the title in some jurisdictions) is the formal title appearing at
				the head of a statute (such as an act of Parliament or of Congress) or other legislative
				instrument.
			</ButtonItem>
			<ButtonItem
				testId="item-button-at-scale-multiple-line-title-and-description"
				shouldTitleWrap
				shouldDescriptionWrap
				description="The long title is intended to provide a summarised description of the purpose or scope of the instrument."
			>
				The long title (properly, the title in some jurisdictions) is the formal title appearing at
				the head of a statute (such as an act of Parliament or of Congress) or other legislative
				instrument.
			</ButtonItem>
			<ButtonItem testId="item-button-before" iconBefore={<EmojiCustomIcon label="" />}>
				With iconBefore prop
			</ButtonItem>
			<ButtonItem testId="item-button-after" iconAfter={<StarIcon label="" />}>
				With iconAfter prop
			</ButtonItem>
			<ButtonItem
				testId="item-button-before-after"
				iconBefore={<EmojiCustomIcon label="" />}
				iconAfter={<StarIcon label="" />}
			>
				With both iconAfter and iconBefore prop
			</ButtonItem>
			<ButtonItem testId="item-button-disabled" isDisabled>
				Disabled Item
			</ButtonItem>
			<ButtonItem testId="item-button-selected" isSelected>
				Selected Item
			</ButtonItem>
			<ButtonItem testId="item-button-description" description="Some textual description">
				Item with description
			</ButtonItem>
			<LinkItem testId="item-link" href="//www.atlassian.com">
				Link item that takes you to atlassian home page
			</LinkItem>
			<LinkItem
				testId="item-link-selected"
				href="//www.atlassian.com"
				iconAfter={Star}
				// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
				css={overrideStyles}
				isSelected
			>
				Selected Link Item
			</LinkItem>
			<LinkItem shouldTitleWrap testId="item-link-multiple-line" href="//www.atlassian.com">
				Link item that takes you to atlassian home page, but with some extra text to make the
				content a bit longer than usual.
			</LinkItem>
			<LinkItem
				shouldTitleWrap
				testId="item-link-long-url-multiple-line"
				href="//www.atlassian.com"
			>
				https://atlassian.design/components/dropdown-menu/dropdown-menu-stateless/examples
			</LinkItem>
			<CustomItem testId="item-custom-em" component={Emphasis}>
				Custom element using em tag
			</CustomItem>
			<CustomItem testId="item-custom-em-disabled" isDisabled component={Emphasis}>
				Disabled custom element using em tag
			</CustomItem>
			<CustomItem shouldTitleWrap testId="item-custom-em-multiple-line" component={Emphasis}>
				Custom element using em tag, but with some extra text to make the content a bit longer than
				usual.
			</CustomItem>

			<Section>
				<SkeletonHeadingItem testId="skeleton-heading-item" />
				<SkeletonItem testId="skeleton-item" />
				<SkeletonItem testId="skeleton-item-avatar" hasAvatar />
				<SkeletonItem testId="skeleton-item-icon" hasIcon />
				<SkeletonItem testId="skeleton-item-width" hasIcon width="100%" />
			</Section>
		</div>
	);
};

export default ItemVariants;
