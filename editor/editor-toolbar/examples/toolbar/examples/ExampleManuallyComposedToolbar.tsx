import React from 'react';

import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { ColorIndicatorWrapper } from '../../../src/ui/ColorIndicatorWrapper';
import { AddIcon } from '../../../src/ui/icons/AddIcon';
import { AIAdjustLengthIcon } from '../../../src/ui/icons/AIAdjustLengthIcon';
import { AIChatIcon } from '../../../src/ui/icons/AIChatIcon';
import { AICommandIcon } from '../../../src/ui/icons/AICommandIcon';
import { AppsIcon } from '../../../src/ui/icons/AppsIcon';
import { BoldIcon } from '../../../src/ui/icons/BoldIcon';
import { CommentIcon } from '../../../src/ui/icons/CommentIcon';
import { HeadingFiveIcon } from '../../../src/ui/icons/HeadingFiveIcon';
import { HeadingFourIcon } from '../../../src/ui/icons/HeadingFourIcon';
import { HeadingOneIcon } from '../../../src/ui/icons/HeadingOneIcon';
import { HeadingSixIcon } from '../../../src/ui/icons/HeadingSixIcon';
import { HeadingThreeIcon } from '../../../src/ui/icons/HeadingThreeIcon';
import { HeadingTwoIcon } from '../../../src/ui/icons/HeadingTwoIcon';
import { ItalicIcon } from '../../../src/ui/icons/ItalicIcon';
import { LinkIcon } from '../../../src/ui/icons/LinkIcon';
import { ListBulletedIcon } from '../../../src/ui/icons/ListBulletedIcon';
import { ListNumberedIcon } from '../../../src/ui/icons/ListNumberedIcon';
import { MoreItemsIcon } from '../../../src/ui/icons/MoreItemsIcon';
import { PinIcon } from '../../../src/ui/icons/PinIcon';
import { PinnedIcon } from '../../../src/ui/icons/PinnedIcon';
import { QuoteIcon } from '../../../src/ui/icons/QuoteIcon';
import { TextColorIcon } from '../../../src/ui/icons/TextColorIcon';
import { TextIcon } from '../../../src/ui/icons/TextIcon';
import { Toolbar } from '../../../src/ui/Toolbar';
import { ToolbarButton } from '../../../src/ui/ToolbarButton';
import { ToolbarButtonGroup } from '../../../src/ui/ToolbarButtonGroup';
import { ToolbarDivider } from '../../../src/ui/ToolbarDivider';
import { ToolbarDropdownItem } from '../../../src/ui/ToolbarDropdownItem';
import { ToolbarDropdownMenu } from '../../../src/ui/ToolbarDropdownMenu';
import { ToolbarKeyboardShortcutHint } from '../../../src/ui/ToolbarKeyboardShortcutHint';
import { ToolbarSection } from '../../../src/ui/ToolbarSection';

import { useExampleToolbarState } from './useExampleToolbarState';

export const ExampleManuallyComposedToolbar = () => {
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
		lastAction,
	} = useExampleToolbarState();

	return (
		<>
			<Toolbar label="Editor Toolbar">
				<ToolbarSection>
					<ToolbarButtonGroup>
						<ToolbarButton
							icon={AIChatIcon}
							label="Ask Rovo"
							onClick={onClick('Ask Rovo')}
							groupLocation="start"
						>
							Ask Rovo
						</ToolbarButton>
						<ToolbarDropdownMenu icon={MoreItemsIcon} label="More formatting" groupLocation="end">
							<ToolbarDropdownItem
								elemBefore={<AIAdjustLengthIcon label="Adjust length" />}
								onClick={onClick('Adjust length')}
							>
								Adjust length
							</ToolbarDropdownItem>
						</ToolbarDropdownMenu>
					</ToolbarButtonGroup>

					<ToolbarButtonGroup>
						<ToolbarButton
							icon={AICommandIcon}
							label="Improve writing"
							onClick={onClick('Improve writing')}
						>
							Improve writing
						</ToolbarButton>
					</ToolbarButtonGroup>
				</ToolbarSection>

				<ToolbarDivider />

				<ToolbarSection>
					<ToolbarButtonGroup>
						<ToolbarDropdownMenu
							icon={
								{
									none: TextIcon,
									normal: TextIcon,
									heading1: HeadingOneIcon,
									heading2: HeadingTwoIcon,
									heading3: HeadingThreeIcon,
									heading4: HeadingFourIcon,
									heading5: HeadingFiveIcon,
									heading6: HeadingSixIcon,
									quote: QuoteIcon,
								}[textStyle]
							}
							label="Text styles"
						>
							<ToolbarDropdownItem
								elemBefore={<TextIcon label="Normal text" />}
								elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⌥0" />}
								onClick={onClick('Normal text', onSetTextStyle('normal'))}
								isSelected={textStyle === 'normal'}
								textStyle="normal"
							>
								Normal text
							</ToolbarDropdownItem>
							<ToolbarDropdownItem
								elemBefore={<HeadingOneIcon label="Heading One" />}
								elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⌥1" />}
								onClick={onClick('Heading one', onSetTextStyle('heading1'))}
								isSelected={textStyle === 'heading1'}
								textStyle="heading1"
							>
								Heading 1
							</ToolbarDropdownItem>
							<ToolbarDropdownItem
								elemBefore={<HeadingTwoIcon label="Heading Two" />}
								elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⌥2" />}
								onClick={onClick('Heading two', onSetTextStyle('heading2'))}
								isSelected={textStyle === 'heading2'}
								textStyle="heading2"
							>
								Heading 2
							</ToolbarDropdownItem>
							<ToolbarDropdownItem
								elemBefore={<HeadingThreeIcon label="Heading Three" />}
								elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⌥3" />}
								onClick={onClick('Heading three', onSetTextStyle('heading3'))}
								isSelected={textStyle === 'heading3'}
								textStyle="heading3"
							>
								Heading 3
							</ToolbarDropdownItem>
							<ToolbarDropdownItem
								elemBefore={<HeadingFourIcon label="Heading Four" />}
								elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⌥4" />}
								onClick={onClick('Heading four', onSetTextStyle('heading4'))}
								isSelected={textStyle === 'heading4'}
								textStyle="heading4"
							>
								Heading 4
							</ToolbarDropdownItem>
							<ToolbarDropdownItem
								elemBefore={<HeadingFiveIcon label="Heading Five" />}
								elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⌥5" />}
								onClick={onClick('Heading five', onSetTextStyle('heading5'))}
								isSelected={textStyle === 'heading5'}
								textStyle="heading5"
							>
								Heading 5
							</ToolbarDropdownItem>
							<ToolbarDropdownItem
								elemBefore={<HeadingSixIcon label="Heading Six" />}
								elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⌥6" />}
								onClick={onClick('Heading six', onSetTextStyle('heading6'))}
								isSelected={textStyle === 'heading6'}
								textStyle="heading6"
							>
								Heading 6
							</ToolbarDropdownItem>
							<ToolbarDropdownItem
								elemBefore={<QuoteIcon label="Quote" />}
								elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⌥9" />}
								onClick={onClick('Quote', onSetTextStyle('quote'))}
								isSelected={textStyle === 'quote'}
								textStyle="normal"
							>
								Quote
							</ToolbarDropdownItem>
						</ToolbarDropdownMenu>
					</ToolbarButtonGroup>

					<ToolbarButtonGroup>
						<ToolbarButton
							icon={formatting.italic && !formatting.bold ? ItalicIcon : BoldIcon}
							label={formatting.italic && !formatting.bold ? 'Italic' : 'Bold'}
							onClick={onClick(
								formatting.italic && !formatting.bold ? 'Italic' : 'Bold',
								onToggleFormatting(formatting.italic && !formatting.bold ? 'italic' : 'bold'),
							)}
							groupLocation="start"
							isSelected={formatting.bold || formatting.italic}
						/>
						<ToolbarDropdownMenu icon={MoreItemsIcon} label="More formatting" groupLocation="end">
							<ToolbarDropdownItem
								elemBefore={<BoldIcon label="Bold" />}
								elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘B" />}
								onClick={onClick('Bold', onToggleFormatting('bold'))}
								isSelected={formatting.bold}
							>
								Bold
							</ToolbarDropdownItem>
							<ToolbarDropdownItem
								elemBefore={<ItalicIcon label="Italic" />}
								elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘I" />}
								onClick={onClick('Italic', onToggleFormatting('italic'))}
								isSelected={formatting.italic}
							>
								Italic
							</ToolbarDropdownItem>
						</ToolbarDropdownMenu>
					</ToolbarButtonGroup>

					<ToolbarButtonGroup>
						<ToolbarDropdownMenu
							icon={({ label, color, shouldRecommendSmallIcon, size, spacing, testId }) => (
								<ColorIndicatorWrapper color={token('color.border.accent.blue')}>
									<TextColorIcon
										label={label}
										color={color}
										shouldRecommendSmallIcon={shouldRecommendSmallIcon}
										size={size}
										spacing={spacing}
										testId={testId}
									/>
								</ColorIndicatorWrapper>
							)}
							label="Text color"
						>
							<ToolbarDropdownItem
								elemBefore={<TextIcon label="Text color" />}
								onClick={onClick('Text color')}
							>
								Text color
							</ToolbarDropdownItem>
						</ToolbarDropdownMenu>
					</ToolbarButtonGroup>

					<ToolbarButtonGroup>
						<ToolbarButton
							icon={listOrAlignment === 'numbered' ? ListNumberedIcon : ListBulletedIcon}
							label={listOrAlignment === 'numbered' ? 'Numbered list' : 'Bulleted list'}
							onClick={onClick(
								listOrAlignment === 'numbered' ? 'Numbered list' : 'Bulleted list',
								onToggleListOrAlignment(listOrAlignment === 'numbered' ? 'numbered' : 'bulleted'),
							)}
							groupLocation="start"
							isSelected={listOrAlignment !== 'none'}
						/>
						<ToolbarDropdownMenu
							icon={MoreItemsIcon}
							label="Lists, indentation and alignment"
							groupLocation="end"
						>
							<ToolbarDropdownItem
								elemBefore={<ListBulletedIcon label="Bulleted list" />}
								elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⇧8" />}
								onClick={onClick('Bulleted list', onToggleListOrAlignment('bulleted'))}
								isSelected={listOrAlignment === 'bulleted'}
							>
								Bulleted list
							</ToolbarDropdownItem>
							<ToolbarDropdownItem
								elemBefore={<ListNumberedIcon label="Numbered list" />}
								elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⇧7" />}
								onClick={onClick('Numbered list', onToggleListOrAlignment('numbered'))}
								isSelected={listOrAlignment === 'numbered'}
							>
								Numbered list
							</ToolbarDropdownItem>
						</ToolbarDropdownMenu>
					</ToolbarButtonGroup>
				</ToolbarSection>

				<ToolbarDivider />

				<ToolbarSection>
					<ToolbarButtonGroup>
						<ToolbarButton icon={LinkIcon} label="Link" onClick={onClick('Link')} />
					</ToolbarButtonGroup>
				</ToolbarSection>

				<ToolbarDivider />

				<ToolbarSection>
					<ToolbarButtonGroup>
						<ToolbarButton icon={CommentIcon} label="Comment" onClick={onClick('Comment')} />
					</ToolbarButtonGroup>
				</ToolbarSection>

				<ToolbarDivider />

				<ToolbarSection>
					<ToolbarButtonGroup>
						<ToolbarDropdownMenu icon={AppsIcon} label="Apps and extensions">
							<ToolbarDropdownItem
								elemBefore={<AddIcon label="Create Jira work item" />}
								onClick={onClick('Create Jira work item')}
							>
								Create Jira work item
							</ToolbarDropdownItem>
						</ToolbarDropdownMenu>
					</ToolbarButtonGroup>
				</ToolbarSection>

				<ToolbarDivider />

				<ToolbarSection>
					<ToolbarButtonGroup>
						<ToolbarButton
							icon={pinning === 'pinned' ? PinnedIcon : PinIcon}
							label={pinning === 'pinned' ? 'Unpin toolbar' : 'Pin toolbar'}
							onClick={onClick(
								pinning === 'pinned' ? 'Unpin toolbar' : 'Pin toolbar',
								onTogglePinning,
							)}
						/>
					</ToolbarButtonGroup>
				</ToolbarSection>
			</Toolbar>
			<Box as="pre">
				{`
Last action: ${lastAction || 'None'}
Text style:  ${textStyle}
Formatting:  ${Object.entries(formatting)
					.filter(([, value]) => value)
					.map(([key]) => key)
					.join(', ')}
List/Align:  ${listOrAlignment}
Pinning:     ${pinning}
				`}
			</Box>
		</>
	);
};
