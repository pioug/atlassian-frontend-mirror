import React, { useState } from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import Toggle from '@atlaskit/toggle';
import { token } from '@atlaskit/tokens';
import { type IconColor } from '@atlaskit/tokens/css-type-schema';

import { AddIcon } from '../../../src/ui/icons/AddIcon';
import { AIAdjustLengthIcon } from '../../../src/ui/icons/AIAdjustLengthIcon';
import { AICasualIcon } from '../../../src/ui/icons/AICasualIcon';
import { AIChangeToneIcon } from '../../../src/ui/icons/AIChangeToneIcon';
import { AIChatIcon } from '../../../src/ui/icons/AIChatIcon';
import { AICommandIcon } from '../../../src/ui/icons/AICommandIcon';
import { AIHeartIcon } from '../../../src/ui/icons/AIHeartIcon';
import { AILengthenIcon } from '../../../src/ui/icons/AILengthenIcon';
import { AIBriefcaseIcon } from '../../../src/ui/icons/AIProfessionalIcon';
import { AIShortenIcon } from '../../../src/ui/icons/AIShortenIcon';
import { AISpellcheckIcon } from '../../../src/ui/icons/AISpellcheckIcon';
import { AITranslateIcon } from '../../../src/ui/icons/AITranslateIcon';
import { AppsIcon } from '../../../src/ui/icons/AppsIcon';
import { BoldIcon } from '../../../src/ui/icons/BoldIcon';
import { ClearFormattingIcon } from '../../../src/ui/icons/ClearFormattingIcon';
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
import { NestedDropdownRightIcon } from '../../../src/ui/icons/NestedDropdownRightIcon';
import { PinIcon } from '../../../src/ui/icons/PinIcon';
import { PinnedIcon } from '../../../src/ui/icons/PinnedIcon';
import { QuoteIcon } from '../../../src/ui/icons/QuoteIcon';
import { TextColorIcon } from '../../../src/ui/icons/TextColorIcon';
import { TextIcon } from '../../../src/ui/icons/TextIcon';
import { Toolbar } from '../../../src/ui/Toolbar';
import { ToolbarButton } from '../../../src/ui/ToolbarButton';
import { ToolbarButtonGroup } from '../../../src/ui/ToolbarButtonGroup';
import { ToolbarColorSwatch } from '../../../src/ui/ToolbarColorSwatch';
import { ToolbarDropdownItem } from '../../../src/ui/ToolbarDropdownItem';
import { ToolbarDropdownItemSection } from '../../../src/ui/ToolbarDropdownItemSection';
import { ToolbarDropdownMenu } from '../../../src/ui/ToolbarDropdownMenu';
import { ToolbarKeyboardShortcutHint } from '../../../src/ui/ToolbarKeyboardShortcutHint';
import { ToolbarNestedDropdownMenu } from '../../../src/ui/ToolbarNestedDropdownMenu';
import { ToolbarSection } from '../../../src/ui/ToolbarSection';
import { ToolbarTooltip } from '../../../src/ui/ToolbarTooltip';

import { useExampleToolbarState } from './useExampleToolbarState';

const headingSizeStylesMap = cssMap({
	xlarge: {
		font: token('font.heading.xlarge'),
	},
	large: {
		font: token('font.heading.large'),
	},
	medium: {
		font: token('font.heading.medium'),
	},
	small: {
		font: token('font.heading.small'),
	},
	xsmall: {
		font: token('font.heading.xsmall'),
	},
	xxsmall: {
		font: token('font.heading.xxsmall'),
	},
});

export const ExampleManuallyComposedToolbar = (): React.JSX.Element => {
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
								iconBefore={<AIChatIcon label="Ask Rovo" />}
								onClick={onClick('Ask Rovo')}
								isDisabled={isRovoDisabled}
							>
								Ask Rovo
							</ToolbarButton>
						</ToolbarTooltip>
						<ToolbarDropdownMenu
							iconBefore={<MoreItemsIcon label="More formatting" />}
							tooltipComponent={<ToolbarTooltip content={'More Rovo options'} />}
						>
							<ToolbarDropdownItemSection>
								<ToolbarNestedDropdownMenu
									elemBefore={<AIAdjustLengthIcon label="Adjust length" />}
									text="Adjust length"
									elemAfter={<NestedDropdownRightIcon label={'Choose desired tone'} />}
									isDisabled={isAdjustLengthDisabled}
								>
									<ToolbarDropdownItemSection>
										<ToolbarDropdownItem
											elemBefore={<AIShortenIcon label="Make shorter" />}
											onClick={onClick('Make shorter')}
										>
											Make shorter
										</ToolbarDropdownItem>
										<ToolbarDropdownItem
											elemBefore={<AILengthenIcon label="Make longer" />}
											onClick={onClick('Make longer')}
										>
											Make longer
										</ToolbarDropdownItem>
									</ToolbarDropdownItemSection>
								</ToolbarNestedDropdownMenu>
								<ToolbarNestedDropdownMenu
									elemBefore={<AIChangeToneIcon label="Change tone" />}
									text="Change tone"
									elemAfter={<NestedDropdownRightIcon label={'Choose desired tone'} />}
								>
									<ToolbarDropdownItemSection>
										<ToolbarDropdownItem
											elemBefore={<AIBriefcaseIcon label="More professional" />}
											onClick={onClick('More professional')}
										>
											More professional
										</ToolbarDropdownItem>
										<ToolbarDropdownItem
											elemBefore={<AICasualIcon label="More casual" />}
											onClick={onClick('More casual')}
										>
											More casual
										</ToolbarDropdownItem>
										<ToolbarDropdownItem
											elemBefore={<AIHeartIcon label="More empathetic" />}
											onClick={onClick('More empathetic')}
										>
											More empathetic
										</ToolbarDropdownItem>
									</ToolbarDropdownItemSection>
								</ToolbarNestedDropdownMenu>
								<ToolbarDropdownItem
									elemBefore={<AISpellcheckIcon label="Fix spelling and grammar" />}
									onClick={onClick('Fix spelling and grammar')}
								>
									Fix spelling and grammar
								</ToolbarDropdownItem>
								<ToolbarNestedDropdownMenu
									elemBefore={<AITranslateIcon label="Translate" />}
									text="Translate"
									elemAfter={<NestedDropdownRightIcon label={'Choose language option'} />}
								>
									<ToolbarDropdownItemSection>
										<ToolbarDropdownItem
											elemBefore={<AITranslateIcon label="Language 1" />}
											onClick={onClick('Language 1')}
										>
											Language 1
										</ToolbarDropdownItem>
										<ToolbarDropdownItem
											elemBefore={<AITranslateIcon label="Language 2" />}
											onClick={onClick('More casual')}
										>
											Language 2
										</ToolbarDropdownItem>
										<ToolbarDropdownItem
											elemBefore={<AITranslateIcon label="Language 3" />}
											onClick={onClick('Language 3')}
										>
											Language 3
										</ToolbarDropdownItem>
									</ToolbarDropdownItemSection>
								</ToolbarNestedDropdownMenu>
							</ToolbarDropdownItemSection>
						</ToolbarDropdownMenu>
					</ToolbarButtonGroup>
					<ToolbarButtonGroup>
						<ToolbarTooltip content="Improve writing">
							<ToolbarButton
								iconBefore={<AICommandIcon label="Improve writing" />}
								onClick={onClick('Improve writing')}
								isDisabled={isImproveWritingDisabled}
							>
								Improve writing
							</ToolbarButton>
						</ToolbarTooltip>
					</ToolbarButtonGroup>
				</ToolbarSection>

				<ToolbarSection>
					<ToolbarButtonGroup>
						<ToolbarDropdownMenu
							iconBefore={
								{
									none: <TextIcon label="Normal text" />,
									normal: <TextIcon label="Normal text" />,
									heading1: <HeadingOneIcon label="Heading One" />,
									heading2: <HeadingTwoIcon label="Heading Two" />,
									heading3: <HeadingThreeIcon label="Heading Three" />,
									heading4: <HeadingFourIcon label="Heading Four" />,
									heading5: <HeadingFiveIcon label="Heading Five" />,
									heading6: <HeadingSixIcon label="Heading Six" />,
									quote: <QuoteIcon label="Quote" />,
								}[textStyle]
							}
							isDisabled={isTextStylesDisabled}
							tooltipComponent={<ToolbarTooltip content="Text Styles" />}
						>
							<ToolbarDropdownItemSection>
								<ToolbarDropdownItem
									elemBefore={<TextIcon label="Normal text" />}
									elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⌥0" />}
									onClick={onClick('Normal text', onSetTextStyle('normal'))}
									isSelected={textStyle === 'normal'}
									ariaKeyshortcuts="⌘⌥0"
								>
									Normal text
								</ToolbarDropdownItem>
								<ToolbarDropdownItem
									elemBefore={<HeadingOneIcon label="Heading One" />}
									elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⌥1" />}
									onClick={onClick('Heading one', onSetTextStyle('heading1'))}
									isSelected={textStyle === 'heading1'}
									ariaKeyshortcuts="⌘⌥1"
								>
									<Box xcss={headingSizeStylesMap.xlarge}>Heading 1</Box>
								</ToolbarDropdownItem>
								<ToolbarDropdownItem
									elemBefore={<HeadingTwoIcon label="Heading Two" />}
									elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⌥2" />}
									onClick={onClick('Heading two', onSetTextStyle('heading2'))}
									isSelected={textStyle === 'heading2'}
									ariaKeyshortcuts="⌘⌥2"
								>
									<Box xcss={headingSizeStylesMap.large}>Heading 2</Box>
								</ToolbarDropdownItem>
								<ToolbarDropdownItem
									elemBefore={<HeadingThreeIcon label="Heading Three" />}
									elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⌥3" />}
									onClick={onClick('Heading three', onSetTextStyle('heading3'))}
									isSelected={textStyle === 'heading3'}
									textStyle="heading3"
									ariaKeyshortcuts="⌘⌥3"
								>
									<Box xcss={headingSizeStylesMap.medium}>Heading 3</Box>
								</ToolbarDropdownItem>
								<ToolbarDropdownItem
									elemBefore={<HeadingFourIcon label="Heading Four" />}
									elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⌥4" />}
									onClick={onClick('Heading four', onSetTextStyle('heading4'))}
									isSelected={textStyle === 'heading4'}
									ariaKeyshortcuts="⌘⌥4"
								>
									<Box xcss={headingSizeStylesMap.small}>Heading 4</Box>
								</ToolbarDropdownItem>
								<ToolbarDropdownItem
									elemBefore={<HeadingFiveIcon label="Heading Five" />}
									elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⌥5" />}
									onClick={onClick('Heading five', onSetTextStyle('heading5'))}
									isSelected={textStyle === 'heading5'}
									ariaKeyshortcuts="⌘⌥5"
								>
									<Box xcss={headingSizeStylesMap.xsmall}>Heading 5</Box>
								</ToolbarDropdownItem>
								<ToolbarDropdownItem
									elemBefore={<HeadingSixIcon label="Heading Six" />}
									elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⌥6" />}
									onClick={onClick('Heading six', onSetTextStyle('heading6'))}
									isSelected={textStyle === 'heading6'}
									ariaKeyshortcuts="⌘⌥6"
								>
									<Box xcss={headingSizeStylesMap.xxsmall}>Heading 6</Box>
								</ToolbarDropdownItem>
								<ToolbarDropdownItem
									elemBefore={<QuoteIcon label="Quote" />}
									elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⌥9" />}
									onClick={onClick('Quote', onSetTextStyle('quote'))}
									isSelected={textStyle === 'quote'}
									ariaKeyshortcuts="⌘⌥9"
								>
									Quote
								</ToolbarDropdownItem>
							</ToolbarDropdownItemSection>
						</ToolbarDropdownMenu>
					</ToolbarButtonGroup>

					<ToolbarButtonGroup>
						<ToolbarTooltip content={formatting.italic && !formatting.bold ? 'Italic' : 'Bold'}>
							<ToolbarButton
								iconBefore={
									formatting.italic && !formatting.bold ? (
										<ItalicIcon label="Italic" />
									) : (
										<BoldIcon label="Bold" />
									)
								}
								onClick={onClick(
									formatting.italic && !formatting.bold ? 'Italic' : 'Bold',
									onToggleFormatting(formatting.italic && !formatting.bold ? 'italic' : 'bold'),
								)}
								isSelected={formatting.bold || formatting.italic}
								isDisabled={formatting.italic ? isItalicDisabled : isBoldDisabled}
								ariaKeyshortcuts={formatting.italic && !formatting.bold ? '⌘I' : '⌘B'}
							/>
						</ToolbarTooltip>
						<ToolbarDropdownMenu
							iconBefore={<MoreItemsIcon label="More formatting" />}
							tooltipComponent={<ToolbarTooltip content="More formatting" />}
						>
							<ToolbarDropdownItemSection>
								<ToolbarDropdownItem
									elemBefore={<BoldIcon label="Bold" />}
									elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘B" />}
									onClick={onClick('Bold', onToggleFormatting('bold'))}
									isSelected={formatting.bold}
									isDisabled={isBoldDisabled}
									ariaKeyshortcuts="⌘B"
								>
									Bold
								</ToolbarDropdownItem>
								<ToolbarDropdownItem
									elemBefore={<ItalicIcon label="Italic" />}
									elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘I" />}
									onClick={onClick('Italic', onToggleFormatting('italic'))}
									isSelected={formatting.italic}
									isDisabled={isItalicDisabled}
									ariaKeyshortcuts="⌘I"
								>
									Italic
								</ToolbarDropdownItem>
							</ToolbarDropdownItemSection>
							<ToolbarDropdownItemSection>
								<ToolbarDropdownItem
									elemBefore={<ClearFormattingIcon label="Clear formatting" />}
									elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘\" />}
									onClick={onClick('Clear formatting')}
									ariaKeyshortcuts="⌘\"
								>
									Clear formatting
								</ToolbarDropdownItem>
							</ToolbarDropdownItemSection>
						</ToolbarDropdownMenu>
					</ToolbarButtonGroup>
					<ToolbarButtonGroup>
						<ToolbarDropdownMenu
							iconBefore={
								<ToolbarColorSwatch highlightColor={token('color.background.accent.blue.subtlest')}>
									<TextColorIcon
										label={'Text color'}
										iconColor={token('color.text.accent.magenta') as IconColor}
										shouldRecommendSmallIcon={true}
										size={'small'}
										isDisabled={isTextColorDisabled}
										spacing={'compact'}
									/>
								</ToolbarColorSwatch>
							}
							isDisabled={isTextColorDisabled}
							tooltipComponent={<ToolbarTooltip content="Text color" />}
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
					</ToolbarButtonGroup>

					<ToolbarButtonGroup>
						<ToolbarTooltip
							content={listOrAlignment === 'numbered' ? 'Numbered list' : 'Bulleted list'}
						>
							<ToolbarButton
								iconBefore={
									listOrAlignment === 'numbered' ? (
										<ListNumberedIcon label="Numbered list" />
									) : (
										<ListBulletedIcon label="Bulleted list" />
									)
								}
								onClick={onClick(
									listOrAlignment === 'numbered' ? 'Numbered list' : 'Bulleted list',
									onToggleListOrAlignment(listOrAlignment === 'numbered' ? 'numbered' : 'bulleted'),
								)}
								isSelected={listOrAlignment !== 'none'}
								isDisabled={
									listOrAlignment === 'numbered' ? isNumberedListDisabled : isBulletedListDisabled
								}
							/>
						</ToolbarTooltip>
						<ToolbarDropdownMenu
							iconBefore={<MoreItemsIcon label="Lists, indentation and alignment" />}
							tooltipComponent={<ToolbarTooltip content="Lists" />}
						>
							<ToolbarDropdownItemSection>
								<ToolbarDropdownItem
									elemBefore={<ListBulletedIcon label="Bulleted list" />}
									elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⇧8" />}
									onClick={onClick('Bulleted list', onToggleListOrAlignment('bulleted'))}
									isSelected={listOrAlignment === 'bulleted'}
									isDisabled={isBulletedListDisabled}
									ariaKeyshortcuts="⌘⇧8"
								>
									Bulleted list
								</ToolbarDropdownItem>
								<ToolbarDropdownItem
									elemBefore={<ListNumberedIcon label="Numbered list" />}
									elemAfter={<ToolbarKeyboardShortcutHint shortcut="⌘⇧7" />}
									onClick={onClick('Numbered list', onToggleListOrAlignment('numbered'))}
									isSelected={listOrAlignment === 'numbered'}
									isDisabled={isNumberedListDisabled}
									ariaKeyshortcuts="⌘⇧7"
								>
									Numbered list
								</ToolbarDropdownItem>
							</ToolbarDropdownItemSection>
						</ToolbarDropdownMenu>
					</ToolbarButtonGroup>
				</ToolbarSection>

				<ToolbarSection>
					<ToolbarButtonGroup>
						<ToolbarTooltip content="Link">
							<ToolbarButton
								iconBefore={<LinkIcon label="Link" />}
								onClick={onClick('Link')}
								isDisabled={isLinkDisabled}
							/>
						</ToolbarTooltip>
					</ToolbarButtonGroup>
				</ToolbarSection>

				<ToolbarSection>
					<ToolbarButtonGroup>
						<ToolbarTooltip content="Comment">
							<ToolbarButton
								iconBefore={<CommentIcon label="Comment" />}
								onClick={onClick('Comment')}
								isDisabled={isCommentDisabled}
							>
								Comment
							</ToolbarButton>
						</ToolbarTooltip>
					</ToolbarButtonGroup>
				</ToolbarSection>

				<ToolbarSection>
					<ToolbarButtonGroup>
						<ToolbarDropdownMenu
							iconBefore={<AppsIcon label="Apps and extensions" />}
							isDisabled={isAppsAndExtensionsDisabled}
							tooltipComponent={<ToolbarTooltip content="Apps and extensions" />}
						>
							<ToolbarDropdownItemSection>
								<ToolbarDropdownItem
									elemBefore={<AddIcon label="Create Jira work item" />}
									onClick={onClick('Create Jira work item')}
									isDisabled={isCreateJiraWorkItemDisabled}
								>
									Create Jira work item
								</ToolbarDropdownItem>
							</ToolbarDropdownItemSection>
						</ToolbarDropdownMenu>
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
