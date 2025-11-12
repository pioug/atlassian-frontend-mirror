import React from 'react';

import { token } from '@atlaskit/tokens';
import { type IconColor } from '@atlaskit/tokens/css-type-schema';

import { AddIcon } from '../../../src/ui/icons/AddIcon';
import { AIChatIcon } from '../../../src/ui/icons/AIChatIcon';
import { AICommandIcon } from '../../../src/ui/icons/AICommandIcon';
import { BoldIcon } from '../../../src/ui/icons/BoldIcon';
import { CommentIcon } from '../../../src/ui/icons/CommentIcon';
import { EmojiIcon } from '../../../src/ui/icons/EmojiIcon';
import { HeadingFiveIcon } from '../../../src/ui/icons/HeadingFiveIcon';
import { HeadingFourIcon } from '../../../src/ui/icons/HeadingFourIcon';
import { HeadingOneIcon } from '../../../src/ui/icons/HeadingOneIcon';
import { HeadingSixIcon } from '../../../src/ui/icons/HeadingSixIcon';
import { HeadingThreeIcon } from '../../../src/ui/icons/HeadingThreeIcon';
import { HeadingTwoIcon } from '../../../src/ui/icons/HeadingTwoIcon';
import { ImageIcon } from '../../../src/ui/icons/ImageIcon';
import { ItalicIcon } from '../../../src/ui/icons/ItalicIcon';
import { LayoutIcon } from '../../../src/ui/icons/LayoutIcon';
import { LinkIcon } from '../../../src/ui/icons/LinkIcon';
import { ListBulletedIcon } from '../../../src/ui/icons/ListBulletedIcon';
import { ListNumberedIcon } from '../../../src/ui/icons/ListNumberedIcon';
import { MentionIcon } from '../../../src/ui/icons/MentionIcon';
import { MoreItemsIcon } from '../../../src/ui/icons/MoreItemsIcon';
import { PinIcon } from '../../../src/ui/icons/PinIcon';
import { PinnedIcon } from '../../../src/ui/icons/PinnedIcon';
import { QuoteIcon } from '../../../src/ui/icons/QuoteIcon';
import { TableIcon } from '../../../src/ui/icons/TableIcon';
import { TaskIcon } from '../../../src/ui/icons/TaskIcon';
import { TextColorIcon } from '../../../src/ui/icons/TextColorIcon';
import { TextIcon } from '../../../src/ui/icons/TextIcon';
import { UnderlineIcon } from '../../../src/ui/icons/UnderlineIcon';
import { type BreakpointPreset, ResponsiveContainer } from '../../../src/ui/ResponsiveContainer';
import { Show } from '../../../src/ui/Show';
import { Toolbar } from '../../../src/ui/Toolbar';
import { ToolbarButton } from '../../../src/ui/ToolbarButton';
import { ToolbarButtonGroup } from '../../../src/ui/ToolbarButtonGroup';
import { ToolbarColorSwatch } from '../../../src/ui/ToolbarColorSwatch';
import { ToolbarDropdownItem } from '../../../src/ui/ToolbarDropdownItem';
import { ToolbarDropdownItemSection } from '../../../src/ui/ToolbarDropdownItemSection';
import { ToolbarDropdownMenu } from '../../../src/ui/ToolbarDropdownMenu';
import { ToolbarSection } from '../../../src/ui/ToolbarSection';
import { ToolbarTooltip } from '../../../src/ui/ToolbarTooltip';

import { useExampleToolbarState } from './useExampleToolbarState';

interface FullToolbarWithPresetProps {
	breakpointPreset?: BreakpointPreset;
}

type TextStyle =
	| 'none'
	| 'normal'
	| 'heading1'
	| 'heading2'
	| 'heading3'
	| 'heading4'
	| 'heading5'
	| 'heading6'
	| 'quote';

// Inline component for text style icon
const TextStyleIcon = ({ textStyle }: { textStyle: TextStyle }) => {
	const iconMap: Record<TextStyle, React.ReactElement> = {
		none: <TextIcon label="Normal text" />,
		normal: <TextIcon label="Normal text" />,
		heading1: <HeadingOneIcon label="Heading One" />,
		heading2: <HeadingTwoIcon label="Heading Two" />,
		heading3: <HeadingThreeIcon label="Heading Three" />,
		heading4: <HeadingFourIcon label="Heading Four" />,
		heading5: <HeadingFiveIcon label="Heading Five" />,
		heading6: <HeadingSixIcon label="Heading Six" />,
		quote: <QuoteIcon label="Quote" />,
	};

	return iconMap[textStyle] || iconMap.normal;
};

// Fullpage preset toolbar - following the pattern from editor plugins
const FullpageToolbar = ({
	onClick,
	textStyle,
	onSetTextStyle,
	formatting,
	onToggleFormatting,
	pinning,
	onTogglePinning,
}: any) => (
	<>
		<ToolbarSection>
			<ToolbarButtonGroup>
				<ToolbarTooltip content="Text styles">
					<ToolbarDropdownMenu iconBefore={<TextStyleIcon textStyle={textStyle} />}>
						<ToolbarDropdownItemSection>
							<ToolbarDropdownItem
								elemBefore={<TextIcon label="Normal text" />}
								onClick={onClick('Normal text', onSetTextStyle('normal'))}
								isSelected={textStyle === 'normal'}
							>
								Normal text
							</ToolbarDropdownItem>
						</ToolbarDropdownItemSection>
					</ToolbarDropdownMenu>
				</ToolbarTooltip>
			</ToolbarButtonGroup>

			{/* Bold button + dropdown for XL */}
			<Show above="lg">
				<ToolbarButtonGroup>
					<ToolbarTooltip content="Bold">
						<ToolbarButton
							iconBefore={<BoldIcon label="Bold" />}
							onClick={onClick('Bold', onToggleFormatting('bold'))}
							isSelected={formatting.bold}
						/>
					</ToolbarTooltip>
					<ToolbarDropdownMenu iconBefore={<MoreItemsIcon label="More formatting" />}>
						<ToolbarDropdownItemSection>
							<ToolbarDropdownItem
								elemBefore={<ItalicIcon label="Italic" />}
								onClick={onClick('Italic')}
							>
								Italic
							</ToolbarDropdownItem>
						</ToolbarDropdownItemSection>
					</ToolbarDropdownMenu>
				</ToolbarButtonGroup>
			</Show>

			{/* Bold dropdown only for MD */}
			<Show above="md">
				<Show below="lg">
					<ToolbarButtonGroup>
						<ToolbarDropdownMenu iconBefore={<BoldIcon label="Bold" />}>
							<ToolbarDropdownItemSection>
								<ToolbarDropdownItem
									elemBefore={<BoldIcon label="Bold" />}
									onClick={onClick('Bold', onToggleFormatting('bold'))}
									isSelected={formatting.bold}
								>
									Bold
								</ToolbarDropdownItem>
								<ToolbarDropdownItem
									elemBefore={<ItalicIcon label="Italic" />}
									onClick={onClick('Italic')}
								>
									Italic
								</ToolbarDropdownItem>
							</ToolbarDropdownItemSection>
						</ToolbarDropdownMenu>
					</ToolbarButtonGroup>
				</Show>
			</Show>

			{/* Lists for MD+ - standalone bullet + numbered dropdown */}
			<Show above="md">
				<ToolbarButtonGroup>
					<ToolbarTooltip content="Bulleted list">
						<ToolbarButton
							iconBefore={<ListBulletedIcon label="Bulleted list" />}
							onClick={onClick('Bulleted list')}
						/>
					</ToolbarTooltip>
					<ToolbarDropdownMenu iconBefore={<MoreItemsIcon label="Lists" />}>
						<ToolbarDropdownItemSection>
							<ToolbarDropdownItem
								elemBefore={<ListBulletedIcon label="Bulleted list" />}
								onClick={onClick('Bulleted list')}
							>
								Bulleted list
							</ToolbarDropdownItem>
							<ToolbarDropdownItem
								elemBefore={<ListNumberedIcon label="Numbered list" />}
								onClick={onClick('Numbered list')}
							>
								Numbered list
							</ToolbarDropdownItem>
						</ToolbarDropdownItemSection>
					</ToolbarDropdownMenu>
				</ToolbarButtonGroup>
			</Show>

			{/* Align button for MD+ */}
			<Show above="md">
				<ToolbarButtonGroup>
					<ToolbarTooltip content="Align">
						<ToolbarButton
							iconBefore={<MoreItemsIcon label="Align" />}
							onClick={onClick('Align')}
						/>
					</ToolbarTooltip>
				</ToolbarButtonGroup>
			</Show>

			{/* Text color for MD+ */}
			<Show above="md">
				<ToolbarButtonGroup>
					<ToolbarTooltip content="Text color">
						<ToolbarDropdownMenu
							iconBefore={
								<ToolbarColorSwatch highlightColor={token('color.background.accent.blue.subtlest')}>
									<TextColorIcon
										label="Text color"
										iconColor={token('color.text.accent.magenta') as IconColor}
										shouldRecommendSmallIcon={true}
										size="small"
										spacing="compact"
									/>
								</ToolbarColorSwatch>
							}
						>
							<ToolbarDropdownItemSection>
								<ToolbarDropdownItem
									elemBefore={<TextIcon label="Text color" />}
									onClick={onClick('Text color')}
								>
									Text color
								</ToolbarDropdownItem>
							</ToolbarDropdownItemSection>
						</ToolbarDropdownMenu>
					</ToolbarTooltip>
				</ToolbarButtonGroup>
			</Show>
		</ToolbarSection>

		<ToolbarSection>
			{/* Insert buttons for XL */}
			<Show above="lg">
				<ToolbarButtonGroup>
					<ToolbarTooltip content="Image">
						<ToolbarButton iconBefore={<ImageIcon label="Image" />} onClick={onClick('Image')} />
					</ToolbarTooltip>
					<ToolbarTooltip content="Mention">
						<ToolbarButton
							iconBefore={<MentionIcon label="Mention" />}
							onClick={onClick('Mention')}
						/>
					</ToolbarTooltip>
					<ToolbarTooltip content="Emoji">
						<ToolbarButton iconBefore={<EmojiIcon label="Emoji" />} onClick={onClick('Emoji')} />
					</ToolbarTooltip>
					<ToolbarTooltip content="Layout">
						<ToolbarButton iconBefore={<LayoutIcon label="Layout" />} onClick={onClick('Layout')} />
					</ToolbarTooltip>
					<ToolbarTooltip content="Task">
						<ToolbarButton iconBefore={<TaskIcon label="Task" />} onClick={onClick('Task')} />
					</ToolbarTooltip>
					<ToolbarDropdownMenu iconBefore={<TableIcon label="Table" />}>
						<ToolbarDropdownItemSection>
							<ToolbarDropdownItem
								elemBefore={<TableIcon label="Table" />}
								onClick={onClick('Table')}
							>
								Table
							</ToolbarDropdownItem>
						</ToolbarDropdownItemSection>
					</ToolbarDropdownMenu>
					<ToolbarTooltip content="Add">
						<ToolbarButton iconBefore={<AddIcon label="Add" />} onClick={onClick('Add')} />
					</ToolbarTooltip>
				</ToolbarButtonGroup>
			</Show>

			{/* Insert buttons for MD (Table + Add only) */}
			<Show above="md">
				<Show below="lg">
					<ToolbarButtonGroup>
						<ToolbarDropdownMenu iconBefore={<TableIcon label="Table" />}>
							<ToolbarDropdownItemSection>
								<ToolbarDropdownItem
									elemBefore={<TableIcon label="Table" />}
									onClick={onClick('Table')}
								>
									Table
								</ToolbarDropdownItem>
							</ToolbarDropdownItemSection>
						</ToolbarDropdownMenu>
						<ToolbarTooltip content="Add">
							<ToolbarButton iconBefore={<AddIcon label="Add" />} onClick={onClick('Add')} />
						</ToolbarTooltip>
					</ToolbarButtonGroup>
				</Show>
			</Show>

			{/* Insert buttons for SM (Add only) */}
			<Show below="md">
				<ToolbarButtonGroup>
					<ToolbarTooltip content="Add">
						<ToolbarButton iconBefore={<AddIcon label="Add" />} onClick={onClick('Add')} />
					</ToolbarTooltip>
				</ToolbarButtonGroup>
			</Show>
		</ToolbarSection>

		<ToolbarSection>
			<ToolbarButtonGroup>
				<ToolbarTooltip content="Link">
					<ToolbarButton iconBefore={<LinkIcon label="Link" />} onClick={onClick('Link')} />
				</ToolbarTooltip>
			</ToolbarButtonGroup>
		</ToolbarSection>

		<ToolbarSection>
			<ToolbarButtonGroup>
				<ToolbarTooltip content={pinning === 'pinned' ? 'Unpin' : 'Pin'}>
					<ToolbarButton
						iconBefore={
							pinning === 'pinned' ? <PinnedIcon label="Unpin" /> : <PinIcon label="Pin" />
						}
						onClick={onClick(pinning === 'pinned' ? 'Unpin' : 'Pin', onTogglePinning)}
					/>
				</ToolbarTooltip>
			</ToolbarButtonGroup>
		</ToolbarSection>
	</>
);

// Jira preset toolbar - NO AI features, starts with text styles dropdown
const JiraToolbar = ({
	onClick,
	textStyle,
	onSetTextStyle,
	formatting,
	onToggleFormatting,
	listOrAlignment,
	onToggleListOrAlignment,
	pinning,
	onTogglePinning,
}: any) => (
	<>
		<ToolbarSection>
			<ToolbarButtonGroup>
				<ToolbarTooltip content="Text styles">
					<ToolbarDropdownMenu iconBefore={<TextStyleIcon textStyle={textStyle} />}>
						<ToolbarDropdownItemSection>
							<ToolbarDropdownItem
								elemBefore={<TextIcon label="Normal text" />}
								onClick={onClick('Normal text', onSetTextStyle('normal'))}
								isSelected={textStyle === 'normal'}
							>
								Normal text
							</ToolbarDropdownItem>
						</ToolbarDropdownItemSection>
					</ToolbarDropdownMenu>
				</ToolbarTooltip>
			</ToolbarButtonGroup>

			{/* Bold + Underline for XL */}
			<Show above="lg">
				<ToolbarButtonGroup>
					<ToolbarTooltip content="Bold">
						<ToolbarButton
							iconBefore={<BoldIcon label="Bold" />}
							onClick={onClick('Bold', onToggleFormatting('bold'))}
							isSelected={formatting.bold}
						/>
					</ToolbarTooltip>
					<ToolbarTooltip content="Underline">
						<ToolbarButton
							iconBefore={<UnderlineIcon label="Underline" />}
							onClick={onClick('Underline')}
						/>
					</ToolbarTooltip>
					<ToolbarDropdownMenu iconBefore={<MoreItemsIcon label="More formatting" />}>
						<ToolbarDropdownItemSection>
							<ToolbarDropdownItem
								elemBefore={<ItalicIcon label="Italic" />}
								onClick={onClick('Italic', onToggleFormatting('italic'))}
								isSelected={formatting.italic}
							>
								Italic
							</ToolbarDropdownItem>
						</ToolbarDropdownItemSection>
					</ToolbarDropdownMenu>
				</ToolbarButtonGroup>
			</Show>

			{/* More formatting dropdown only for below LG */}
			<Show below="lg">
				<ToolbarButtonGroup>
					<ToolbarDropdownMenu iconBefore={<MoreItemsIcon label="More formatting" />}>
						<ToolbarDropdownItemSection>
							<ToolbarDropdownItem
								elemBefore={<BoldIcon label="Bold" />}
								onClick={onClick('Bold', onToggleFormatting('bold'))}
								isSelected={formatting.bold}
							>
								Bold
							</ToolbarDropdownItem>
							<ToolbarDropdownItem
								elemBefore={<ItalicIcon label="Italic" />}
								onClick={onClick('Italic', onToggleFormatting('italic'))}
								isSelected={formatting.italic}
							>
								Italic
							</ToolbarDropdownItem>
						</ToolbarDropdownItemSection>
					</ToolbarDropdownMenu>
				</ToolbarButtonGroup>
			</Show>

			{/* Lists for MD+ - standalone bullet + numbered dropdown */}
			<Show above="md">
				<ToolbarButtonGroup>
					<ToolbarTooltip content="Bulleted list">
						<ToolbarButton
							iconBefore={<ListBulletedIcon label="Bulleted list" />}
							onClick={onClick('Bulleted list', onToggleListOrAlignment('bulleted'))}
							isSelected={listOrAlignment === 'bulleted'}
						/>
					</ToolbarTooltip>
					<ToolbarDropdownMenu iconBefore={<MoreItemsIcon label="Lists" />}>
						<ToolbarDropdownItemSection>
							<ToolbarDropdownItem
								elemBefore={<ListBulletedIcon label="Bulleted list" />}
								onClick={onClick('Bulleted list', onToggleListOrAlignment('bulleted'))}
								isSelected={listOrAlignment === 'bulleted'}
							>
								Bulleted list
							</ToolbarDropdownItem>
							<ToolbarDropdownItem
								elemBefore={<ListNumberedIcon label="Numbered list" />}
								onClick={onClick('Numbered list', onToggleListOrAlignment('numbered'))}
								isSelected={listOrAlignment === 'numbered'}
							>
								Numbered list
							</ToolbarDropdownItem>
						</ToolbarDropdownItemSection>
					</ToolbarDropdownMenu>
				</ToolbarButtonGroup>
			</Show>

			{/* Text color for SM+ */}
			<Show above="sm">
				<ToolbarButtonGroup>
					<ToolbarTooltip content="Text color">
						<ToolbarDropdownMenu
							iconBefore={
								<ToolbarColorSwatch highlightColor={token('color.background.accent.blue.subtlest')}>
									<TextColorIcon
										label="Text color"
										iconColor={token('color.text.accent.magenta') as IconColor}
										shouldRecommendSmallIcon={true}
										size="small"
										spacing="compact"
									/>
								</ToolbarColorSwatch>
							}
						>
							<ToolbarDropdownItemSection>
								<ToolbarDropdownItem
									elemBefore={<TextIcon label="Text color" />}
									onClick={onClick('Text color')}
								>
									Text color
								</ToolbarDropdownItem>
							</ToolbarDropdownItemSection>
						</ToolbarDropdownMenu>
					</ToolbarTooltip>
				</ToolbarButtonGroup>
			</Show>
		</ToolbarSection>

		<ToolbarSection>
			<ToolbarButtonGroup>
				<Show above="lg">
					<ToolbarTooltip content="Link">
						<ToolbarButton iconBefore={<LinkIcon label="Link" />} onClick={onClick('Link')} />
					</ToolbarTooltip>
					<ToolbarTooltip content="Comment">
						<ToolbarButton
							iconBefore={<CommentIcon label="Comment" />}
							onClick={onClick('Comment')}
						/>
					</ToolbarTooltip>
				</Show>
				<Show above="sm">
					<ToolbarTooltip content="Add">
						<ToolbarButton iconBefore={<AddIcon label="Add" />} onClick={onClick('Add')} />
					</ToolbarTooltip>
				</Show>
			</ToolbarButtonGroup>
		</ToolbarSection>

		<ToolbarSection>
			<ToolbarButtonGroup>
				<ToolbarTooltip
					content={pinning === 'pinned' ? 'Unpin the toolbar' : 'Pin the toolbar at the top'}
				>
					<ToolbarButton
						iconBefore={
							pinning === 'pinned' ? (
								<PinnedIcon label="Unpin toolbar" />
							) : (
								<PinIcon label="Pin toolbar" />
							)
						}
						onClick={onClick(
							pinning === 'pinned' ? 'Unpin toolbar' : 'Pin toolbar',
							onTogglePinning,
						)}
					/>
				</ToolbarTooltip>
			</ToolbarButtonGroup>
		</ToolbarSection>
	</>
);

// Confluence Comment preset toolbar
const ConfluenceCommentToolbar = ({
	onClick,
	formatting,
	onToggleFormatting,
	listOrAlignment,
	onToggleListOrAlignment,
}: any) => (
	<>
		<ToolbarSection>
			{/* Ask Rovo for XL */}
			<Show above="xl">
				<ToolbarButtonGroup>
					<ToolbarTooltip content="Ask Rovo">
						<ToolbarButton
							iconBefore={<AIChatIcon label="Ask Rovo" />}
							onClick={onClick('Ask Rovo')}
						/>
					</ToolbarTooltip>
				</ToolbarButtonGroup>
			</Show>

			{/* Improve writing for LG+ */}
			<Show above="lg">
				<ToolbarButtonGroup>
					<ToolbarTooltip content="Improve writing">
						<ToolbarButton
							iconBefore={<AICommandIcon label="Improve writing" />}
							onClick={onClick('Improve writing')}
						>
							Improve writing
						</ToolbarButton>
					</ToolbarTooltip>
				</ToolbarButtonGroup>
			</Show>

			{/* Text styles for MD+ */}
			<Show above="md">
				<ToolbarButtonGroup>
					<ToolbarTooltip content="Text styles">
						<ToolbarButton
							iconBefore={<TextIcon label="Text styles" />}
							onClick={onClick('Text styles')}
						/>
					</ToolbarTooltip>
				</ToolbarButtonGroup>
			</Show>

			{/* Bold button for XL */}
			<Show above="xl">
				<ToolbarButtonGroup>
					<ToolbarTooltip content="Bold">
						<ToolbarButton
							iconBefore={<BoldIcon label="Bold" />}
							onClick={onClick('Bold', onToggleFormatting('bold'))}
							isSelected={formatting.bold}
						/>
					</ToolbarTooltip>
				</ToolbarButtonGroup>
			</Show>

			{/* More formatting dropdown for LG+ */}
			<Show above="lg">
				<ToolbarButtonGroup>
					<ToolbarDropdownMenu iconBefore={<MoreItemsIcon label="More formatting" />}>
						<ToolbarDropdownItemSection>
							<ToolbarDropdownItem
								elemBefore={<BoldIcon label="Bold" />}
								onClick={onClick('Bold', onToggleFormatting('bold'))}
								isSelected={formatting.bold}
							>
								Bold
							</ToolbarDropdownItem>
							<ToolbarDropdownItem
								elemBefore={<ItalicIcon label="Italic" />}
								onClick={onClick('Italic', onToggleFormatting('italic'))}
								isSelected={formatting.italic}
							>
								Italic
							</ToolbarDropdownItem>
						</ToolbarDropdownItemSection>
					</ToolbarDropdownMenu>
				</ToolbarButtonGroup>
			</Show>

			{/* Lists for MD+ - standalone bullet + numbered dropdown */}
			<Show above="md">
				<ToolbarButtonGroup>
					<ToolbarTooltip content="Bulleted list">
						<ToolbarButton
							iconBefore={<ListBulletedIcon label="Bulleted list" />}
							onClick={onClick('Bulleted list', onToggleListOrAlignment('bulleted'))}
							isSelected={listOrAlignment === 'bulleted'}
						/>
					</ToolbarTooltip>
					<ToolbarDropdownMenu iconBefore={<MoreItemsIcon label="Lists" />}>
						<ToolbarDropdownItemSection>
							<ToolbarDropdownItem
								elemBefore={<ListBulletedIcon label="Bulleted list" />}
								onClick={onClick('Bulleted list', onToggleListOrAlignment('bulleted'))}
								isSelected={listOrAlignment === 'bulleted'}
							>
								Bulleted list
							</ToolbarDropdownItem>
							<ToolbarDropdownItem
								elemBefore={<ListNumberedIcon label="Numbered list" />}
								onClick={onClick('Numbered list', onToggleListOrAlignment('numbered'))}
								isSelected={listOrAlignment === 'numbered'}
							>
								Numbered list
							</ToolbarDropdownItem>
						</ToolbarDropdownItemSection>
					</ToolbarDropdownMenu>
				</ToolbarButtonGroup>
			</Show>

			{/* Text color for SM+ */}
			<Show above="sm">
				<ToolbarButtonGroup>
					<ToolbarTooltip content="Text color">
						<ToolbarDropdownMenu
							iconBefore={
								<ToolbarColorSwatch highlightColor={token('color.background.accent.blue.subtlest')}>
									<TextColorIcon
										label="Text color"
										iconColor={token('color.text.accent.magenta') as IconColor}
										shouldRecommendSmallIcon={true}
										size="small"
										spacing="compact"
									/>
								</ToolbarColorSwatch>
							}
						>
							<ToolbarDropdownItemSection>
								<ToolbarDropdownItem
									elemBefore={<TextIcon label="Text color" />}
									onClick={onClick('Text color')}
								>
									Text color
								</ToolbarDropdownItem>
							</ToolbarDropdownItemSection>
						</ToolbarDropdownMenu>
					</ToolbarTooltip>
				</ToolbarButtonGroup>
			</Show>
		</ToolbarSection>

		<ToolbarSection>
			<ToolbarButtonGroup>
				<Show above="xl">
					<ToolbarTooltip content="Link">
						<ToolbarButton iconBefore={<LinkIcon label="Link" />} onClick={onClick('Link')} />
					</ToolbarTooltip>
					<ToolbarTooltip content="Add">
						<ToolbarButton iconBefore={<AddIcon label="Add" />} onClick={onClick('Add')} />
					</ToolbarTooltip>
				</Show>
				<Show above="lg">
					<ToolbarTooltip content="Comment">
						<ToolbarButton
							iconBefore={<CommentIcon label="Comment" />}
							onClick={onClick('Comment')}
						/>
					</ToolbarTooltip>
				</Show>
				<Show above="sm">
					<ToolbarTooltip content="More">
						<ToolbarButton iconBefore={<MoreItemsIcon label="More" />} onClick={onClick('More')} />
					</ToolbarTooltip>
				</Show>
			</ToolbarButtonGroup>
		</ToolbarSection>
	</>
);

// JSM preset toolbar
const JSMToolbar = ({
	onClick,
	textStyle,
	onSetTextStyle,
	formatting,
	onToggleFormatting,
	listOrAlignment,
	onToggleListOrAlignment,
}: any) => (
	<>
		<ToolbarSection>
			{/* Ask Rovo for LG+ */}
			<Show above="lg">
				<ToolbarButtonGroup>
					<ToolbarTooltip content="Ask Rovo">
						<ToolbarButton
							iconBefore={<AIChatIcon label="Ask Rovo" />}
							onClick={onClick('Ask Rovo')}
						/>
					</ToolbarTooltip>
				</ToolbarButtonGroup>
			</Show>

			{/* Improve writing for MD+ */}
			<Show above="md">
				<ToolbarButtonGroup>
					<ToolbarTooltip content="Improve writing">
						<ToolbarButton
							iconBefore={<AICommandIcon label="Improve writing" />}
							onClick={onClick('Improve writing')}
						>
							Improve writing
						</ToolbarButton>
					</ToolbarTooltip>
				</ToolbarButtonGroup>
			</Show>

			{/* Text styles for SM+ */}
			<Show above="sm">
				<ToolbarButtonGroup>
					<ToolbarTooltip content="Text styles">
						<ToolbarButton
							iconBefore={<TextIcon label="Text styles" />}
							onClick={onClick('Text styles')}
						/>
					</ToolbarTooltip>
				</ToolbarButtonGroup>
			</Show>

			{/* Bold button for XL */}
			<Show above="xl">
				<ToolbarButtonGroup>
					<ToolbarTooltip content="Bold">
						<ToolbarButton
							iconBefore={<BoldIcon label="Bold" />}
							onClick={onClick('Bold', onToggleFormatting('bold'))}
							isSelected={formatting.bold}
						/>
					</ToolbarTooltip>
				</ToolbarButtonGroup>
			</Show>

			{/* More formatting dropdown for LG+ */}
			<Show above="lg">
				<ToolbarButtonGroup>
					<ToolbarDropdownMenu iconBefore={<MoreItemsIcon label="More formatting" />}>
						<ToolbarDropdownItemSection>
							<ToolbarDropdownItem
								elemBefore={<BoldIcon label="Bold" />}
								onClick={onClick('Bold', onToggleFormatting('bold'))}
								isSelected={formatting.bold}
							>
								Bold
							</ToolbarDropdownItem>
							<ToolbarDropdownItem
								elemBefore={<ItalicIcon label="Italic" />}
								onClick={onClick('Italic', onToggleFormatting('italic'))}
								isSelected={formatting.italic}
							>
								Italic
							</ToolbarDropdownItem>
						</ToolbarDropdownItemSection>
					</ToolbarDropdownMenu>
				</ToolbarButtonGroup>
			</Show>

			{/* Lists for MD+ - standalone bullet + numbered dropdown */}
			<Show above="md">
				<ToolbarButtonGroup>
					<ToolbarTooltip content="Bulleted list">
						<ToolbarButton
							iconBefore={<ListBulletedIcon label="Bulleted list" />}
							onClick={onClick('Bulleted list', onToggleListOrAlignment('bulleted'))}
							isSelected={listOrAlignment === 'bulleted'}
						/>
					</ToolbarTooltip>
					<ToolbarDropdownMenu iconBefore={<MoreItemsIcon label="Lists" />}>
						<ToolbarDropdownItemSection>
							<ToolbarDropdownItem
								elemBefore={<ListBulletedIcon label="Bulleted list" />}
								onClick={onClick('Bulleted list', onToggleListOrAlignment('bulleted'))}
								isSelected={listOrAlignment === 'bulleted'}
							>
								Bulleted list
							</ToolbarDropdownItem>
							<ToolbarDropdownItem
								elemBefore={<ListNumberedIcon label="Numbered list" />}
								onClick={onClick('Numbered list', onToggleListOrAlignment('numbered'))}
								isSelected={listOrAlignment === 'numbered'}
							>
								Numbered list
							</ToolbarDropdownItem>
						</ToolbarDropdownItemSection>
					</ToolbarDropdownMenu>
				</ToolbarButtonGroup>
			</Show>

			{/* Text color for SM+ */}
			<Show above="sm">
				<ToolbarButtonGroup>
					<ToolbarTooltip content="Text color">
						<ToolbarDropdownMenu
							iconBefore={
								<ToolbarColorSwatch highlightColor={token('color.background.accent.blue.subtlest')}>
									<TextColorIcon
										label="Text color"
										iconColor={token('color.text.accent.magenta') as IconColor}
										shouldRecommendSmallIcon={true}
										size="small"
										spacing="compact"
									/>
								</ToolbarColorSwatch>
							}
						>
							<ToolbarDropdownItemSection>
								<ToolbarDropdownItem
									elemBefore={<TextIcon label="Text color" />}
									onClick={onClick('Text color')}
								>
									Text color
								</ToolbarDropdownItem>
							</ToolbarDropdownItemSection>
						</ToolbarDropdownMenu>
					</ToolbarTooltip>
				</ToolbarButtonGroup>
			</Show>
		</ToolbarSection>

		<ToolbarSection>
			<ToolbarButtonGroup>
				<Show above="lg">
					<ToolbarTooltip content="Link">
						<ToolbarButton iconBefore={<LinkIcon label="Link" />} onClick={onClick('Link')} />
					</ToolbarTooltip>
					<ToolbarTooltip content="Comment">
						<ToolbarButton
							iconBefore={<CommentIcon label="Comment" />}
							onClick={onClick('Comment')}
						/>
					</ToolbarTooltip>
					<ToolbarTooltip content="Add">
						<ToolbarButton iconBefore={<AddIcon label="Add" />} onClick={onClick('Add')} />
					</ToolbarTooltip>
				</Show>
				<Show above="sm">
					<ToolbarTooltip content="More">
						<ToolbarButton iconBefore={<MoreItemsIcon label="More" />} onClick={onClick('More')} />
					</ToolbarTooltip>
				</Show>
			</ToolbarButtonGroup>
		</ToolbarSection>
	</>
);

export const FullToolbarWithPreset = ({ breakpointPreset }: FullToolbarWithPresetProps) => {
	const {
		textStyle,
		onSetTextStyle,
		formatting,
		onToggleFormatting,
		listOrAlignment,
		onToggleListOrAlignment,
		pinning,
		onTogglePinning,
		onClick,
	} = useExampleToolbarState();

	const toolbarProps = {
		onClick,
		textStyle,
		onSetTextStyle,
		formatting,
		onToggleFormatting,
		listOrAlignment,
		onToggleListOrAlignment,
		pinning,
		onTogglePinning,
	};

	const renderToolbarContent = () => {
		switch (breakpointPreset) {
			case 'fullpage':
				return <FullpageToolbar {...toolbarProps} />;
			case 'jira-issue':
				return <JiraToolbar {...toolbarProps} />;
			case 'confluence-comment':
				return <ConfluenceCommentToolbar {...toolbarProps} />;
			case 'jsm-comment':
				return <JSMToolbar {...toolbarProps} />;
			case 'reduced':
			default:
				// Default to Jira-like toolbar for reduced preset
				return <JiraToolbar {...toolbarProps} />;
		}
	};

	return (
		<ResponsiveContainer breakpointPreset={breakpointPreset}>
			<Toolbar label="Editor Toolbar">{renderToolbarContent()}</Toolbar>
		</ResponsiveContainer>
	);
};
