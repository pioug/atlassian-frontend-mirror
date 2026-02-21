import React, { useCallback, useState } from 'react';

import Button, { IconButton, SplitButton } from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Heading from '@atlaskit/heading';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import WorldIcon from '@atlaskit/icon/core/globe';
import LinkIcon from '@atlaskit/icon/core/link';
import UnlockFilledIcon from '@atlaskit/icon/core/lock-unlocked';
import PageIcon from '@atlaskit/icon/core/page';
import EditorSearchIcon from '@atlaskit/icon/core/search';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

export default (): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	return (
		<Box padding="space.250">
			<Stack space="space.250">
				<Stack space="space.150">
					<Heading size="medium">Visual variants. Secondary action is DropdownMenu trigger</Heading>
					<Inline space="space.250">
						<SplitButton spacing="compact">
							<Button>Primary action</Button>
							<DropdownMenu<HTMLButtonElement>
								shouldRenderToParent
								trigger={({ triggerRef, ...triggerProps }) => (
									<IconButton
										ref={triggerRef}
										{...triggerProps}
										icon={ChevronDownIcon}
										label="Open link work item options"
									/>
								)}
							>
								<DropdownItemGroup>
									<DropdownItem>Option one</DropdownItem>
									<DropdownItem>Option two</DropdownItem>
								</DropdownItemGroup>
							</DropdownMenu>
						</SplitButton>
						<SplitButton appearance="primary" spacing="compact">
							<Button>Primary action</Button>
							<DropdownMenu<HTMLButtonElement>
								shouldRenderToParent
								trigger={({ triggerRef, ...triggerProps }) => (
									<IconButton
										ref={triggerRef}
										{...triggerProps}
										icon={ChevronDownIcon}
										label="See options"
									/>
								)}
							>
								<DropdownItemGroup>
									<DropdownItem>Option one</DropdownItem>
									<DropdownItem>Option two</DropdownItem>
								</DropdownItemGroup>
							</DropdownMenu>
						</SplitButton>
						<SplitButton isDisabled spacing="compact">
							<Button>Primary action</Button>
							<DropdownMenu<HTMLButtonElement>
								shouldRenderToParent
								trigger={({ triggerRef, ...triggerProps }) => (
									<IconButton
										ref={triggerRef}
										{...triggerProps}
										icon={ChevronDownIcon}
										label="See options"
									/>
								)}
							>
								<DropdownItemGroup>
									<DropdownItem>Option one</DropdownItem>
									<DropdownItem>Option two</DropdownItem>
								</DropdownItemGroup>
							</DropdownMenu>
						</SplitButton>
					</Inline>
					<Inline space="space.150">
						<SplitButton>
							<Button>Primary action</Button>
							<DropdownMenu<HTMLButtonElement>
								shouldRenderToParent
								trigger={({ triggerRef, ...triggerProps }) => (
									<IconButton
										ref={triggerRef}
										{...triggerProps}
										icon={ChevronDownIcon}
										label="See options"
									/>
								)}
							>
								<DropdownItemGroup>
									<DropdownItem>Option one</DropdownItem>
									<DropdownItem>Option two</DropdownItem>
								</DropdownItemGroup>
							</DropdownMenu>
						</SplitButton>
						<SplitButton appearance="primary">
							<Button>Primary action</Button>
							<DropdownMenu<HTMLButtonElement>
								shouldRenderToParent
								trigger={({ triggerRef, ...triggerProps }) => (
									<IconButton
										ref={triggerRef}
										{...triggerProps}
										icon={ChevronDownIcon}
										label="See options"
									/>
								)}
							>
								<DropdownItemGroup>
									<DropdownItem>Option one</DropdownItem>
									<DropdownItem>Option two</DropdownItem>
								</DropdownItemGroup>
							</DropdownMenu>
						</SplitButton>
						<SplitButton isDisabled>
							<Button>Primary action</Button>
							<DropdownMenu<HTMLButtonElement>
								shouldRenderToParent
								trigger={({ triggerRef, ...triggerProps }) => (
									<IconButton
										ref={triggerRef}
										{...triggerProps}
										icon={ChevronDownIcon}
										label="See options"
									/>
								)}
							>
								<DropdownItemGroup>
									<DropdownItem>Option one</DropdownItem>
									<DropdownItem>Option two</DropdownItem>
								</DropdownItemGroup>
							</DropdownMenu>
						</SplitButton>
					</Inline>
				</Stack>
				<Stack space="space.150">
					<Heading size="medium">Visual variants. Secondary action is ModalDialog trigger</Heading>
					<Inline space="space.250">
						<SplitButton spacing="compact">
							<Button>Primary action</Button>
							<IconButton onClick={open} icon={ChevronDownIcon} label="Secondary action" />
						</SplitButton>
						<SplitButton appearance="primary" spacing="compact">
							<Button>Primary action</Button>
							<IconButton
								onClick={open}
								icon={ChevronDownIcon}
								label="Secondary action"
								shape="circle" // intentionally ignored as not supported in split button
							/>
						</SplitButton>
						<SplitButton isDisabled spacing="compact">
							<Button>Primary action</Button>
							<IconButton onClick={open} icon={ChevronDownIcon} label="Secondary action" />
						</SplitButton>
					</Inline>
					<Inline space="space.150">
						<SplitButton>
							<Button isSelected>Primary action</Button>
							<IconButton onClick={open} icon={ChevronDownIcon} label="Secondary action" />
						</SplitButton>
						<SplitButton>
							<Button>Primary action</Button>
							<IconButton
								isSelected
								onClick={open}
								icon={ChevronDownIcon}
								label="Secondary action"
							/>
						</SplitButton>
						<SplitButton appearance="primary">
							<Button isSelected>Primary action</Button>
							<IconButton onClick={open} icon={ChevronDownIcon} label="Secondary action" />
						</SplitButton>
						<SplitButton appearance="primary">
							<Button>Primary action</Button>
							<IconButton
								isSelected
								onClick={open}
								icon={ChevronDownIcon}
								label="Secondary action"
							/>
						</SplitButton>
						<SplitButton isDisabled>
							<Button>Primary action</Button>
							<IconButton
								isSelected
								onClick={open}
								icon={ChevronDownIcon}
								label="Secondary action"
							/>
						</SplitButton>
					</Inline>
				</Stack>
				<Stack space="space.150">
					<Heading size="medium">Confluence editor top bar</Heading>
					<ConfluenceEditorTopBarExample />
				</Stack>
				<Stack space="space.150">
					<Heading size="medium">Jira work item view actions</Heading>
					<JiraWorkItemViewActionsExample />
				</Stack>
				<Stack space="space.150">
					<Heading size="medium">With wrappers example</Heading>

					<WithWrappersExample />
				</Stack>
			</Stack>
			<ModalTransition>
				{isOpen && (
					<Modal onClose={close} testId="modal">
						<ModalHeader hasCloseButton>
							<ModalTitle>Modal dialog</ModalTitle>
						</ModalHeader>
						<ModalBody>Modal dialog body</ModalBody>
						<ModalFooter>
							<Button appearance="default" onClick={close}>
								Default action
							</Button>
							<Button appearance="primary" onClick={close}>
								Primary action
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		</Box>
	);
};

const boxStyles = xcss({
	borderColor: 'color.border',
	borderStyle: 'solid',
	borderRadius: 'radius.small',
	borderWidth: 'border.width',
	paddingBlockStart: 'space.100',
	paddingBlockEnd: 'space.100',
	paddingInlineStart: 'space.200',
	paddingInlineEnd: 'space.200',
	display: 'flex',
	justifyContent: 'flex-end',
	maxWidth: '500px',
});

const ConfluenceEditorTopBarExample = () => {
	const [isOpen, setIsOpen] = useState(false);
	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	return (
		<>
			<Box xcss={boxStyles}>
				<Inline space="space.150">
					<IconButton appearance="subtle" icon={EditorSearchIcon} label="Search" />
					<IconButton appearance="subtle" icon={UnlockFilledIcon} label="Lock" />
					<SplitButton appearance="primary">
						<Tooltip content="Update with current settings">
							{(tooltipProps) => <Button {...tooltipProps}>Update</Button>}
						</Tooltip>
						<Tooltip content="Adjust update settings">
							{(tooltipProps) => (
								<IconButton
									{...tooltipProps}
									icon={ChevronDownIcon}
									label="Show update page dialog"
									onClick={open}
								/>
							)}
						</Tooltip>
					</SplitButton>
					<Button appearance="subtle">Close</Button>
					<IconButton appearance="subtle" icon={MoreIcon} label="Menu" />
				</Inline>
			</Box>
			<ModalTransition>
				{isOpen && (
					<Modal onClose={close} testId="modal">
						<ModalHeader hasCloseButton>
							<ModalTitle>Update page</ModalTitle>
						</ModalHeader>
						<ModalBody>Update page form</ModalBody>
						<ModalFooter>
							<Button appearance="default" onClick={close}>
								Preview
							</Button>
							<Button appearance="primary" onClick={close}>
								Update
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		</>
	);
};

const JiraWorkItemViewActionsExample = () => {
	return (
		<Inline space="space.100">
			<Button>Attach</Button>
			<Button>Create task in epic</Button>
			<SplitButton appearance="default">
				<Button iconBefore={LinkIcon}>Link task</Button>
				<DropdownMenu<HTMLButtonElement>
					shouldRenderToParent
					trigger={({ triggerRef, ...triggerProps }) => (
						<IconButton
							ref={triggerRef}
							{...triggerProps}
							icon={ChevronDownIcon}
							label="Open link task options"
						/>
					)}
					placement="bottom-end"
				>
					<DropdownItemGroup>
						<DropdownItem elemBefore={<PageIcon spacing="spacious" label="" />}>
							Link Confluence page
						</DropdownItem>
						<DropdownItem elemBefore={<WorldIcon spacing="spacious" label="" />}>
							Add web link
						</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>
			</SplitButton>
		</Inline>
	);
};

const WithWrappersExample = () => {
	return (
		<Inline space="space.100">
			<SplitButton appearance="default">
				<div>
					<Button iconBefore={LinkIcon}>Link task</Button>
				</div>
				<div>
					<DropdownMenu<HTMLButtonElement>
						shouldRenderToParent
						trigger={({ triggerRef, ...triggerProps }) => (
							<IconButton
								ref={triggerRef}
								{...triggerProps}
								icon={ChevronDownIcon}
								label="Open link task options"
							/>
						)}
						placement="bottom-end"
					>
						<DropdownItemGroup>
							<DropdownItem elemBefore={<PageIcon spacing="spacious" label="" />}>
								Link Confluence page
							</DropdownItem>
							<DropdownItem elemBefore={<WorldIcon spacing="spacious" label="" />}>
								Add web link
							</DropdownItem>
						</DropdownItemGroup>
					</DropdownMenu>
				</div>
			</SplitButton>
			<SplitButton appearance="primary">
				<div>
					<div>
						<span>
							<div>
								<Button iconBefore={LinkIcon}>Link task</Button>
							</div>
						</span>
					</div>
				</div>
				<div>
					<span>
						<DropdownMenu<HTMLButtonElement>
							shouldRenderToParent
							trigger={({ triggerRef, ...triggerProps }) => (
								<IconButton
									ref={triggerRef}
									{...triggerProps}
									icon={ChevronDownIcon}
									label="Open link task options"
								/>
							)}
							placement="bottom-end"
						>
							<DropdownItemGroup>
								<DropdownItem elemBefore={<PageIcon spacing="spacious" label="" />}>
									Link Confluence page
								</DropdownItem>
								<DropdownItem elemBefore={<WorldIcon spacing="spacious" label="" />}>
									Add web link
								</DropdownItem>
							</DropdownItemGroup>
						</DropdownMenu>
					</span>
				</div>
			</SplitButton>
		</Inline>
	);
};
