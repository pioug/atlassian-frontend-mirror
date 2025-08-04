import React from 'react';

import {
	AIAdjustLengthIcon,
	AIChatIcon,
	AICommandIcon,
	BoldIcon,
	CommentIcon,
	HeadingFiveIcon,
	HeadingFourIcon,
	HeadingOneIcon,
	HeadingSixIcon,
	HeadingThreeIcon,
	HeadingTwoIcon,
	ItalicIcon,
	LinkIcon,
	ListBulletedIcon,
	ListNumberedIcon,
	MoreItemsIcon,
	PinIcon,
	QuoteIcon,
	TextColorIcon,
	TextIcon,
	ToolbarButton,
	ToolbarButtonGroup,
	ToolbarDropdownItem,
	ToolbarDropdownItemSection,
	ToolbarDropdownMenu,
	ToolbarKeyboardShortcutHint,
	ToolbarSection,
} from '@atlaskit/editor-toolbar';
import { type RegisterComponent } from '@atlaskit/editor-toolbar-model';
import { token } from '@atlaskit/tokens';
import type { IconColor } from '@atlaskit/tokens/css-type-schema';

// AI
export const registerAIToolbarComponents = (): Array<RegisterComponent> => {
	return [
		{
			type: 'section',
			key: 'ai',
			parents: [
				{
					type: 'toolbar',
					key: 'selection-toolbar',
					rank: 10,
				},
			],
			component: ({ children }) => {
				return <ToolbarSection>{children}</ToolbarSection>;
			},
		},
		{
			type: 'group',
			key: 'rovo',
			parents: [
				{
					type: 'section',
					key: 'ai',
					rank: 10,
				},
			],
			component: ({ children }) => {
				return <ToolbarButtonGroup>{children}</ToolbarButtonGroup>;
			},
		},
		{
			type: 'button',
			key: 'rovo-button',
			parents: [
				{
					type: 'group',
					key: 'rovo',
					rank: 10,
				},
			],
			component: ({ groupLocation }) => {
				return (
					<ToolbarButton
						iconBefore={<AIChatIcon label="Ask Rovo" />}
						onClick={() => {}}
						groupLocation={groupLocation}
					>
						Ask Rovo
					</ToolbarButton>
				);
			},
		},
		{
			type: 'menu',
			key: 'rovo-menu',
			parents: [
				{
					type: 'group',
					key: 'rovo',
					rank: 10,
				},
			],
			component: ({ children, groupLocation }) => {
				return (
					<ToolbarDropdownMenu
						iconBefore={<MoreItemsIcon label="More formatting" />}
						groupLocation={groupLocation}
					>
						{children}
					</ToolbarDropdownMenu>
				);
			},
		},
		{
			type: 'menu-section',
			key: 'rovo-menu-section',
			parents: [
				{
					type: 'menu',
					key: 'rovo-menu',
					rank: 10,
				},
			],
			component: ({ children }) => {
				return <ToolbarDropdownItemSection>{children}</ToolbarDropdownItemSection>;
			},
		},
		{
			type: 'menu-item',
			parents: [
				{
					type: 'menu-section',
					key: 'rovo-menu-section',
					rank: 10,
				},
			],
			key: 'rovo-menu-item',
			component: () => {
				return (
					<ToolbarDropdownItem
						elemBefore={<AIAdjustLengthIcon label="Adjust length" />}
						onClick={() => {}}
					>
						Adjust length
					</ToolbarDropdownItem>
				);
			},
		},
		{
			type: 'group',
			key: 'ai-quick-actions',
			parents: [
				{
					type: 'section',
					key: 'ai',
					rank: 10,
				},
			],
			component: ({ children }) => {
				return <ToolbarButtonGroup>{children}</ToolbarButtonGroup>;
			},
		},
		{
			type: 'button',
			key: 'improve-writing',
			parents: [
				{
					type: 'group',
					key: 'ai-quick-actions',
					rank: 10,
				},
			],
			component: () => {
				return (
					<ToolbarButton iconBefore={<AICommandIcon label="Improve writing" />} onClick={() => {}}>
						Improve writing
					</ToolbarButton>
				);
			},
		},
	];
};

export const registerTextStylesToolbarComponents = (): Array<RegisterComponent> => {
	return [
		{
			type: 'section',
			key: 'text-formatting',
			parents: [
				{
					type: 'toolbar',
					key: 'selection-toolbar',
					rank: 30,
				},
			],
			component: ({ children }) => {
				return <ToolbarSection>{children}</ToolbarSection>;
			},
		},
	];
};

// packages/editor/editor-plugin-block-type/src/blockTypePlugin.tsx
export const registerBlockTypeToolbarComponents = (): Array<RegisterComponent> => {
	return [
		{
			type: 'group',
			key: 'text-styles',
			parents: [
				{
					type: 'section',
					key: 'text-formatting',
					rank: 30,
				},
			],
			component: ({ children }) => {
				return <ToolbarButtonGroup>{children}</ToolbarButtonGroup>;
			},
		},
		// This will be uncommented when responsiveness is implemented
		// {
		// 	type: 'group',
		// 	key: 'text-styles-all-items',
		// 	parents: [
		// 		{
		// 			type: 'section',
		// 			key: 'text-formatting',
		// 			rank: 30,
		// 		},
		// 	],
		// 	component: ({ children }) => {
		// 		return <ToolbarButtonGroup>{children}</ToolbarButtonGroup>;
		// 	},
		// },
		{
			type: 'menu',
			key: 'text-styles-menu-all-items',
			parents: [
				{
					type: 'group',
					key: 'text-styles-all-items',
					rank: 10,
				},
			],
			component: ({ children }) => {
				if (!children) {
					return null;
				}

				return (
					<ToolbarDropdownMenu iconBefore={<TextIcon label="Text styles" />}>
						{children}
					</ToolbarDropdownMenu>
				);
			},
		},
		{
			type: 'menu',
			key: 'text-styles-menu',
			parents: [
				{
					type: 'group',
					key: 'text-styles',
					rank: 10,
				},
			],
			component: ({ children }) => {
				if (!children) {
					return null;
				}

				return (
					<ToolbarDropdownMenu iconBefore={<TextIcon label="Text styles" />}>
						{children}
					</ToolbarDropdownMenu>
				);
			},
		},
		{
			type: 'menu-section',
			key: 'text-styles-menu-section',
			parents: [
				{
					type: 'menu',
					key: 'text-styles-menu',
					rank: 10,
				},
			],
			component: ({ children }) => {
				return <ToolbarDropdownItemSection>{children}</ToolbarDropdownItemSection>;
			},
		},
		{
			type: 'menu-item',
			parents: [
				{
					type: 'menu-section',
					key: 'text-styles-menu-section',
					rank: 10,
				},
				// {
				// 	type: 'menu',
				// 	key: 'text-styles-menu-all-items',
				// 	rank: 10,
				// },
			],
			key: 'paragraph',

			component: () => {
				return (
					<ToolbarDropdownItem
						elemBefore={<TextIcon label="Normal text" />}
						elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⌥0" />}
						onClick={() => {}}
						isSelected={false}
						textStyle="normal"
					>
						Normal text
					</ToolbarDropdownItem>
				);
			},
		},
		{
			type: 'menu-item',
			parents: [
				{
					type: 'menu-section',
					key: 'text-styles-menu-section',
					rank: 20,
				},
				// {
				// 	type: 'menu',
				// 	key: 'text-styles-menu-all-items',
				// 	rank: 20,
				// },
			],
			key: 'heading-1',

			component: () => {
				return (
					<ToolbarDropdownItem
						elemBefore={<HeadingOneIcon label="Heading One" />}
						elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⌥1" />}
						onClick={() => {}}
						isSelected={false}
						textStyle="heading1"
					>
						Heading 1
					</ToolbarDropdownItem>
				);
			},
		},
		{
			type: 'menu-item',
			parents: [
				{
					type: 'menu-section',
					key: 'text-styles-menu-section',
					rank: 30,
				},
				// {
				// 	type: 'menu',
				// 	key: 'text-styles-menu-all-items',
				// 	rank: 30,
				// },
			],
			key: 'heading-2',

			component: () => {
				return (
					<ToolbarDropdownItem
						elemBefore={<HeadingTwoIcon label="Heading Two" />}
						elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⌥2" />}
						onClick={() => {}}
						isSelected={false}
						textStyle="heading2"
					>
						Heading 2
					</ToolbarDropdownItem>
				);
			},
		},
		{
			type: 'menu-item',
			parents: [
				{
					type: 'menu-section',
					key: 'text-styles-menu-section',
					rank: 40,
				},
				// {
				// 	type: 'menu',
				// 	key: 'text-styles-menu-all-items',
				// 	rank: 40,
				// },
			],
			key: 'heading-3',

			component: () => {
				return (
					<ToolbarDropdownItem
						elemBefore={<HeadingThreeIcon label="Heading Three" />}
						elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⌥3" />}
						onClick={() => {}}
						isSelected={false}
						textStyle="heading3"
					>
						Heading 3
					</ToolbarDropdownItem>
				);
			},
		},
		{
			type: 'menu-item',
			parents: [
				{
					type: 'menu-section',
					key: 'text-styles-menu-section',
					rank: 50,
				},
				// {
				// 	type: 'menu',
				// 	key: 'text-styles-menu-all-items',
				// 	rank: 50,
				// },
			],
			key: 'heading-4',
			component: () => {
				return (
					<ToolbarDropdownItem
						elemBefore={<HeadingFourIcon label="Heading Four" />}
						elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⌥4" />}
						onClick={() => {}}
						isSelected={false}
						textStyle="heading4"
					>
						Heading 4
					</ToolbarDropdownItem>
				);
			},
		},
		{
			type: 'menu-item',
			parents: [
				{
					type: 'menu-section',
					key: 'text-styles-menu-section',
					rank: 60,
				},
				// {
				// 	type: 'menu',
				// 	key: 'text-styles-menu-all-items',
				// 	rank: 60,
				// },
			],
			key: 'heading-5',

			component: () => {
				return (
					<ToolbarDropdownItem
						elemBefore={<HeadingFiveIcon label="Heading Five" />}
						elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⌥5" />}
						onClick={() => {}}
						isSelected={false}
						textStyle="heading5"
					>
						Heading 5
					</ToolbarDropdownItem>
				);
			},
		},
		{
			type: 'menu-item',
			parents: [
				{
					type: 'menu-section',
					key: 'text-styles-menu-section',
					rank: 70,
				},
				// {
				// 	type: 'menu',
				// 	key: 'text-styles-menu-all-items',
				// 	rank: 70,
				// },
			],
			key: 'heading-6',

			component: () => {
				return (
					<ToolbarDropdownItem
						elemBefore={<HeadingSixIcon label="Heading Six" />}
						elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⌥6" />}
						onClick={() => {}}
						isSelected={false}
						textStyle="heading6"
					>
						Heading 6
					</ToolbarDropdownItem>
				);
			},
		},
		{
			type: 'menu-section',
			key: 'text-styles-quote-section',
			parents: [
				{
					type: 'menu',
					key: 'text-styles-menu',
					rank: 80,
				},
				{
					type: 'menu',
					key: 'text-styles-menu-all-items',
					rank: 80,
				},
			],
			component: ({ children }) => {
				return <ToolbarDropdownItemSection>{children}</ToolbarDropdownItemSection>;
			},
		},
		{
			type: 'menu-item',
			parents: [
				{
					type: 'menu-section',
					key: 'text-styles-quote-section',
					rank: 80,
				},
			],
			key: 'quote',
			component: () => {
				return (
					<ToolbarDropdownItem
						elemBefore={<QuoteIcon label="Quote" />}
						elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⌥9" />}
						onClick={() => {}}
						isSelected={false}
						textStyle="normal"
					>
						Quote
					</ToolbarDropdownItem>
				);
			},
		},
	];
};

export const registerTextFormattingToolbarComponents = (): Array<RegisterComponent> => {
	return [
		{
			type: 'group',
			key: 'text-formatting',
			parents: [
				{
					type: 'section',
					key: 'text-formatting',
					rank: 40,
				},
			],
			component: ({ children }) => {
				return <ToolbarButtonGroup>{children}</ToolbarButtonGroup>;
			},
		},
		{
			type: 'button',
			key: 'hero-text-formatting',
			parents: [
				{
					type: 'group',
					key: 'text-formatting',
					rank: 10,
				},
			],
			component: ({ groupLocation }) => {
				return (
					<ToolbarButton
						iconBefore={<BoldIcon label="Bold" />}
						onClick={() => {}}
						groupLocation={groupLocation}
						isSelected={false}
					/>
				);
			},
		},
		{
			type: 'menu',
			key: 'text-formatting-menu',
			parents: [
				{
					type: 'group',
					key: 'text-formatting',
					rank: 10,
				},
			],
			component: ({ children, groupLocation }) => {
				return (
					<ToolbarDropdownMenu
						iconBefore={<MoreItemsIcon label="More formatting" />}
						groupLocation={groupLocation}
					>
						{children}
					</ToolbarDropdownMenu>
				);
			},
		},
		{
			type: 'menu-section',
			key: 'text-formatting-menu-section',
			parents: [
				{
					type: 'menu',
					key: 'text-formatting-menu',
					rank: 20,
				},
			],
			component: ({ children }) => {
				return <ToolbarDropdownItemSection>{children}</ToolbarDropdownItemSection>;
			},
		},
		{
			type: 'menu-item',
			key: 'bold',
			parents: [
				{
					type: 'menu-section',
					key: 'text-formatting-menu-section',
					rank: 20,
				},
				// {
				// 	type: 'menu',
				// 	key: 'text-styles-menu-all-items',
				// 	rank: 90,
				// },
			],
			component: () => {
				return (
					<ToolbarDropdownItem
						elemBefore={<BoldIcon label="Bold" />}
						elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘B" />}
						onClick={() => {}}
						isSelected={false}
					>
						Bold
					</ToolbarDropdownItem>
				);
			},
		},
		{
			type: 'menu-item',
			key: 'italic',
			parents: [
				{
					type: 'menu-section',
					key: 'text-formatting-menu-section',
					rank: 30,
				},
				// {
				// 	type: 'menu',
				// 	key: 'text-styles-menu-all-items',
				// 	rank: 100,
				// },
			],
			component: () => {
				return (
					<ToolbarDropdownItem
						elemBefore={<ItalicIcon label="Italic" />}
						elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘I" />}
						onClick={() => {}}
						isSelected={false}
					>
						Italic
					</ToolbarDropdownItem>
				);
			},
		},
	];
};

export const registerTextColorToolbarComponents = (): Array<RegisterComponent> => {
	return [
		{
			type: 'group',
			key: 'text-color-group',
			parents: [
				{
					type: 'section',
					key: 'text-formatting',
					rank: 45,
				},
			],
			component: ({ children }) => {
				return <ToolbarButtonGroup>{children}</ToolbarButtonGroup>;
			},
		},
		{
			type: 'menu',
			key: 'text-color-menu',
			parents: [
				{
					type: 'group',
					key: 'text-color-group',
					rank: 10,
				},
			],
			component: ({ children }) => {
				return (
					<ToolbarDropdownMenu
						iconBefore={
							<TextColorIcon
								label="Text color"
								color={token('color.text.accent.magenta') as IconColor}
								shouldRecommendSmallIcon={true}
								size="small"
								spacing="compact"
								testId={'text-color-icon'}
							/>
						}
					>
						{children}
					</ToolbarDropdownMenu>
				);
			},
		},
		{
			type: 'menu-section',
			key: 'text-color-menu-section',
			parents: [
				{
					type: 'menu',
					key: 'text-color-menu',
					rank: 10,
				},
			],
			component: ({ children }) => {
				return <ToolbarDropdownItemSection>{children}</ToolbarDropdownItemSection>;
			},
		},
		{
			type: 'menu-item',
			parents: [
				{
					type: 'menu-section',
					key: 'text-color-menu-section',
					rank: 10,
				},
			],
			key: 'text-color-item',
			component: () => {
				return (
					<ToolbarDropdownItem
						elemBefore={<TextIcon label="Text color" />}
						onClick={() => {}}
						isSelected={false}
					>
						Text color
					</ToolbarDropdownItem>
				);
			},
		},
	];
};

export const registerListsToolbarComponents = (): Array<RegisterComponent> => {
	return [
		{
			type: 'group',
			key: 'lists-group',
			parents: [
				{
					type: 'section',
					key: 'text-formatting',
					rank: 40,
				},
			],
			component: ({ children }) => {
				return <ToolbarButtonGroup>{children}</ToolbarButtonGroup>;
			},
		},
		{
			type: 'button',
			key: 'lists-button',
			parents: [
				{
					type: 'group',
					key: 'lists-group',
					rank: 10,
				},
			],
			component: () => {
				return (
					<ToolbarButton
						iconBefore={<ListBulletedIcon label="Bulleted list" />}
						onClick={() => {}}
					/>
				);
			},
		},
		{
			type: 'menu',
			key: 'lists-menu',
			parents: [
				{
					type: 'group',
					key: 'lists-group',
					rank: 10,
				},
			],
			component: ({ children, groupLocation }) => {
				return (
					<ToolbarDropdownMenu
						iconBefore={<MoreItemsIcon label="Lists" />}
						groupLocation={groupLocation}
					>
						{children}
					</ToolbarDropdownMenu>
				);
			},
		},
		{
			type: 'menu-section',
			key: 'lists-menu-section',
			parents: [
				{
					type: 'menu',
					key: 'lists-menu',
					rank: 10,
				},
			],
			component: ({ children }) => {
				return <ToolbarDropdownItemSection>{children}</ToolbarDropdownItemSection>;
			},
		},
		{
			type: 'menu-item',
			parents: [
				{
					type: 'menu-section',
					key: 'lists-menu-section',
					rank: 10,
				},
				// {
				// 	type: 'menu',
				// 	key: 'text-styles-menu-all-items',
				// 	rank: 110,
				// },
			],
			key: 'bulleted-list',
			component: () => {
				return (
					<ToolbarDropdownItem
						elemBefore={<ListBulletedIcon label="Bulleted list" />}
						elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⇧8" />}
						onClick={() => {}}
						isSelected={false}
					>
						Bulleted list
					</ToolbarDropdownItem>
				);
			},
		},
		{
			type: 'menu-item',
			parents: [
				{
					type: 'menu-section',
					key: 'lists-menu-section',
					rank: 20,
				},
				// {
				// 	type: 'menu',
				// 	key: 'text-styles-menu-all-items',
				// 	rank: 120,
				// },
			],
			key: 'numbered-list',
			component: () => {
				return (
					<ToolbarDropdownItem
						elemBefore={<ListNumberedIcon label="Numbered list" />}
						elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⇧7" />}
						onClick={() => {}}
						isSelected={false}
					>
						Numbered list
					</ToolbarDropdownItem>
				);
			},
		},
	];
};

export const registerLinkToolbarComponents = (): Array<RegisterComponent> => {
	return [
		{
			type: 'section',
			key: 'link',
			parents: [
				{
					type: 'toolbar',
					key: 'selection-toolbar',
					rank: 50,
				},
			],
			component: ({ children }) => {
				return <ToolbarSection>{children}</ToolbarSection>;
			},
		},
		{
			type: 'group',
			key: 'link-group',
			parents: [
				{
					type: 'section',
					key: 'link',
					rank: 10,
				},
			],
			component: ({ children }) => {
				return <ToolbarButtonGroup>{children}</ToolbarButtonGroup>;
			},
		},
		{
			type: 'button',
			key: 'link-button',
			parents: [
				{
					type: 'group',
					key: 'link-group',
					rank: 10,
				},
			],
			component: () => {
				return <ToolbarButton iconBefore={<LinkIcon label="Link" />} onClick={() => {}} />;
			},
		},
	];
};

export const registerCommentToolbarComponents = (): Array<RegisterComponent> => {
	return [
		{
			type: 'section',
			key: 'comment',
			parents: [
				{
					type: 'toolbar',
					key: 'selection-toolbar',
					rank: 60,
				},
			],
			component: ({ children }) => {
				return <ToolbarSection>{children}</ToolbarSection>;
			},
		},
		{
			type: 'group',
			key: 'comment-group',
			parents: [
				{
					type: 'section',
					key: 'comment',
					rank: 10,
				},
			],
			component: ({ children }) => {
				return <ToolbarButtonGroup>{children}</ToolbarButtonGroup>;
			},
		},
		{
			type: 'button',
			key: 'comment-button',
			parents: [
				{
					type: 'group',
					key: 'comment-group',
					rank: 10,
				},
			],
			component: () => {
				return (
					<ToolbarButton iconBefore={<CommentIcon label="Comment" />} onClick={() => {}}>
						Comment
					</ToolbarButton>
				);
			},
		},
	];
};

export const registerOverflowToolbarComponents = (): Array<RegisterComponent> => {
	return [
		{
			type: 'section',
			key: 'overflow',
			parents: [
				{
					type: 'toolbar',
					key: 'selection-toolbar',
					rank: 70,
				},
			],
			component: ({ children }) => {
				return <ToolbarSection>{children}</ToolbarSection>;
			},
		},
		{
			type: 'group',
			key: 'overflow-group',
			parents: [
				{
					type: 'section',
					key: 'overflow',
					rank: 10,
				},
			],
			component: ({ children }) => {
				return <ToolbarButtonGroup>{children}</ToolbarButtonGroup>;
			},
		},
		{
			type: 'menu',
			key: 'overflow-menu',
			parents: [
				{
					type: 'group',
					key: 'overflow-group',
					rank: 10,
				},
			],
			component: ({ children }) => {
				return <ToolbarDropdownMenu iconBefore={<span>...</span>}>{children}</ToolbarDropdownMenu>;
			},
		},
		{
			type: 'menu-section',
			key: 'overflow-menu-section',
			parents: [
				{
					type: 'menu',
					key: 'overflow-menu',
					rank: 10,
				},
			],
			component: ({ children }) => {
				return <ToolbarDropdownItemSection>{children}</ToolbarDropdownItemSection>;
			},
		},
		{
			type: 'menu-item',
			key: 'overflow-menu-item',
			parents: [
				{
					type: 'menu-section',
					key: 'overflow-menu-section',
					rank: 10,
				},
			],

			component: () => {
				return (
					<ToolbarDropdownItem elemBefore={<PinIcon label="Pin" />} onClick={() => {}}>
						Pin
					</ToolbarDropdownItem>
				);
			},
		},
	];
};
