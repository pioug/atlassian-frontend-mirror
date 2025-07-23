import React, { useState } from 'react';

import { Box } from '@atlaskit/primitives/compiled';
import Toggle from '@atlaskit/toggle';
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
import { ToolbarTooltip } from '../../../src/ui/ToolbarTooltip';

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

	const [isRovoDisabled, setIsRovoDisabled] = useState(false);
	const toggleRovoButton = () => {
		setIsRovoDisabled(!isRovoDisabled);
	};

	const [isAdjustLengthDisabled, setIsAdjustLengthDisabled] = useState(false);
	const toggleAdjustLengthButton = () => {
		setIsAdjustLengthDisabled(!isAdjustLengthDisabled);
	};

	const [isTextStylesDisabled, setIsTextStylesDisabled] = useState(false);
	const toggleTextStylesButton = () => {
		setIsTextStylesDisabled(!isTextStylesDisabled);
	};

	const [isImproveWritingDisabled, setIsImproveWritingDisabled] = useState(false);
	const toggleImproveWritingButton = () => {
		setIsImproveWritingDisabled(!isImproveWritingDisabled);
	};

	const [isBoldDisabled, setIsBoldDisabled] = useState(false);
	const toggleBoldStyle = () => {
		setIsBoldDisabled(!isBoldDisabled);
	};

	const [isItalicDisabled, setIsItalicDisabled] = useState(false);
	const toggleItalicStyle = () => {
		setIsItalicDisabled(!isItalicDisabled);
	};

	const [isTextColorDisabled, setIsTextColorDisabled] = useState(false);
	const toggleTextColorButton = () => {
		setIsTextColorDisabled(!isTextColorDisabled);
	};

	const [isBulletedListDisabled, setIsBulletedListDisabled] = useState(false);
	const toggleBulletedListButton = () => {
		setIsBulletedListDisabled(!isBulletedListDisabled);
	};

	const [isNumberedListDisabled, setIsNumberedListDisabled] = useState(false);
	const toggleNumberedListButton = () => {
		setIsNumberedListDisabled(!isNumberedListDisabled);
	};

	const [isLinkDisabled, setIsLinkDisabled] = useState(false);
	const toggleLinkButton = () => {
		setIsLinkDisabled(!isLinkDisabled);
	};

	const [isCommentDisabled, setIsCommentDisabled] = useState(false);
	const toggleCommentButton = () => {
		setIsCommentDisabled(!isCommentDisabled);
	};

	const [isCreateJiraWorkItemDisabled, setIsCreateJiraWorkItemDisabled] = useState(false);
	const toggleCreateJiraWorkItemButton = () => {
		setIsCreateJiraWorkItemDisabled(!isCreateJiraWorkItemDisabled);
	};

	const [isAppsAndExtensionsDisabled, setIsAppsAndExtensionsDisabled] = useState(false);
	const toggleAppsAndExtensionsButton = () => {
		setIsAppsAndExtensionsDisabled(!isAppsAndExtensionsDisabled);
	};

	return (
		<>
			<Toolbar label="Editor Toolbar">
				<ToolbarSection>
					<ToolbarButtonGroup>
						<ToolbarTooltip content="Ask Rovo">
							<ToolbarButton
								icon={AIChatIcon}
								label="Ask Rovo"
								onClick={onClick('Ask Rovo')}
								groupLocation="start"
								isDisabled={isRovoDisabled}
							>
								Ask Rovo
							</ToolbarButton>
						</ToolbarTooltip>
						<ToolbarDropdownMenu icon={MoreItemsIcon} label="More formatting" groupLocation="end">
							<ToolbarDropdownItem
								elemBefore={<AIAdjustLengthIcon label="Adjust length" />}
								onClick={onClick('Adjust length')}
								isDisabled={isAdjustLengthDisabled}
							>
								Adjust length
							</ToolbarDropdownItem>
						</ToolbarDropdownMenu>
					</ToolbarButtonGroup>

					<ToolbarButtonGroup>
						<ToolbarTooltip content="Improve writing">
							<ToolbarButton
								icon={AICommandIcon}
								label="Improve writing"
								onClick={onClick('Improve writing')}
								isDisabled={isImproveWritingDisabled}
							>
								Improve writing
							</ToolbarButton>
						</ToolbarTooltip>
					</ToolbarButtonGroup>
				</ToolbarSection>

				<ToolbarDivider />

				<ToolbarSection>
					<ToolbarButtonGroup>
						<ToolbarTooltip content="Text styles">
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
								isDisabled={isTextStylesDisabled}
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
						</ToolbarTooltip>
					</ToolbarButtonGroup>

					<ToolbarButtonGroup>
						<ToolbarTooltip content={formatting.italic && !formatting.bold ? 'Italic' : 'Bold'}>
							<ToolbarButton
								icon={formatting.italic && !formatting.bold ? ItalicIcon : BoldIcon}
								label={formatting.italic && !formatting.bold ? 'Italic' : 'Bold'}
								onClick={onClick(
									formatting.italic && !formatting.bold ? 'Italic' : 'Bold',
									onToggleFormatting(formatting.italic && !formatting.bold ? 'italic' : 'bold'),
								)}
								groupLocation="start"
								isSelected={formatting.bold || formatting.italic}
								isDisabled={formatting.italic ? isItalicDisabled : isBoldDisabled}
							/>
						</ToolbarTooltip>
						<ToolbarDropdownMenu icon={MoreItemsIcon} label="More formatting" groupLocation="end">
							<ToolbarDropdownItem
								elemBefore={<BoldIcon label="Bold" />}
								elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘B" />}
								onClick={onClick('Bold', onToggleFormatting('bold'))}
								isSelected={formatting.bold}
								isDisabled={isBoldDisabled}
							>
								Bold
							</ToolbarDropdownItem>
							<ToolbarDropdownItem
								elemBefore={<ItalicIcon label="Italic" />}
								elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘I" />}
								onClick={onClick('Italic', onToggleFormatting('italic'))}
								isSelected={formatting.italic}
								isDisabled={isItalicDisabled}
							>
								Italic
							</ToolbarDropdownItem>
						</ToolbarDropdownMenu>
					</ToolbarButtonGroup>

					<ToolbarButtonGroup>
						<ToolbarTooltip content="Text color">
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
								isDisabled={isTextColorDisabled}
							>
								<ToolbarDropdownItem
									elemBefore={<TextIcon label="Text color" />}
									onClick={onClick('Text color')}
								>
									Text color
								</ToolbarDropdownItem>
							</ToolbarDropdownMenu>
						</ToolbarTooltip>
					</ToolbarButtonGroup>

					<ToolbarButtonGroup>
						<ToolbarTooltip
							content={listOrAlignment === 'numbered' ? 'Numbered list' : 'Bulleted list'}
						>
							<ToolbarButton
								icon={listOrAlignment === 'numbered' ? ListNumberedIcon : ListBulletedIcon}
								label={listOrAlignment === 'numbered' ? 'Numbered list' : 'Bulleted list'}
								onClick={onClick(
									listOrAlignment === 'numbered' ? 'Numbered list' : 'Bulleted list',
									onToggleListOrAlignment(listOrAlignment === 'numbered' ? 'numbered' : 'bulleted'),
								)}
								groupLocation="start"
								isSelected={listOrAlignment !== 'none'}
								isDisabled={
									listOrAlignment === 'numbered' ? isNumberedListDisabled : isBulletedListDisabled
								}
							/>
						</ToolbarTooltip>
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
								isDisabled={isBulletedListDisabled}
							>
								Bulleted list
							</ToolbarDropdownItem>
							<ToolbarDropdownItem
								elemBefore={<ListNumberedIcon label="Numbered list" />}
								elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⇧7" />}
								onClick={onClick('Numbered list', onToggleListOrAlignment('numbered'))}
								isSelected={listOrAlignment === 'numbered'}
								isDisabled={isNumberedListDisabled}
							>
								Numbered list
							</ToolbarDropdownItem>
						</ToolbarDropdownMenu>
					</ToolbarButtonGroup>
				</ToolbarSection>

				<ToolbarDivider />

				<ToolbarSection>
					<ToolbarButtonGroup>
						<ToolbarTooltip content="Link">
							<ToolbarButton
								icon={LinkIcon}
								label="Link"
								onClick={onClick('Link')}
								isDisabled={isLinkDisabled}
							/>
						</ToolbarTooltip>
					</ToolbarButtonGroup>
				</ToolbarSection>

				<ToolbarDivider />

				<ToolbarSection>
					<ToolbarButtonGroup>
						<ToolbarTooltip content="Comment">
							<ToolbarButton
								icon={CommentIcon}
								label="Comment"
								onClick={onClick('Comment')}
								isDisabled={isCommentDisabled}
							/>
						</ToolbarTooltip>
					</ToolbarButtonGroup>
				</ToolbarSection>

				<ToolbarDivider />

				<ToolbarSection>
					<ToolbarButtonGroup>
						<ToolbarTooltip content="Apps and extensions">
							<ToolbarDropdownMenu
								icon={AppsIcon}
								label="Apps and extensions"
								isDisabled={isAppsAndExtensionsDisabled}
							>
								<ToolbarDropdownItem
									elemBefore={<AddIcon label="Create Jira work item" />}
									onClick={onClick('Create Jira work item')}
									isDisabled={isCreateJiraWorkItemDisabled}
								>
									Create Jira work item
								</ToolbarDropdownItem>
							</ToolbarDropdownMenu>
						</ToolbarTooltip>
					</ToolbarButtonGroup>
				</ToolbarSection>

				<ToolbarDivider />

				<ToolbarSection>
					<ToolbarButtonGroup>
						<ToolbarTooltip
							content={pinning === 'pinned' ? 'Unpin the toolbar' : 'Pin the toolbar at the top'}
						>
							<ToolbarButton
								icon={pinning === 'pinned' ? PinnedIcon : PinIcon}
								label={pinning === 'pinned' ? 'Unpin toolbar' : 'Pin toolbar'}
								onClick={onClick(
									pinning === 'pinned' ? 'Unpin toolbar' : 'Pin toolbar',
									onTogglePinning,
								)}
							/>
						</ToolbarTooltip>
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
			<Box>
				<div>
					Disable Rovo Button
					<Toggle onChange={toggleRovoButton} />
				</div>
				<div>
					Disable Adjust Length Button
					<Toggle onChange={toggleAdjustLengthButton} />
				</div>
				<div>
					Disable Improve Writing Button
					<Toggle onChange={toggleImproveWritingButton} />
				</div>
				<div>
					Disable Text Styles
					<Toggle onChange={toggleTextStylesButton} />
				</div>
				<div>
					Disable Bold Formatting
					<Toggle onChange={toggleBoldStyle} />
				</div>
				<div>
					Disable Italic Formatting
					<Toggle onChange={toggleItalicStyle} />
				</div>
				<div>
					Disable Text Color
					<Toggle onChange={toggleTextColorButton} />
				</div>
				<div>
					Disable Bulleted List
					<Toggle onChange={toggleBulletedListButton} />
				</div>
				<div>
					Disable Numbered List
					<Toggle onChange={toggleNumberedListButton} />
				</div>
				<div>
					Disable Link
					<Toggle onChange={toggleLinkButton} />
				</div>
				<div>
					Disable Comment
					<Toggle onChange={toggleCommentButton} />
				</div>
				<div>
					Disable Apps and Extensions
					<Toggle onChange={toggleAppsAndExtensionsButton} />
				</div>
				<div>
					Disable Create Jira Work Item
					<Toggle onChange={toggleCreateJiraWorkItemButton} />
				</div>
			</Box>
		</>
	);
};
