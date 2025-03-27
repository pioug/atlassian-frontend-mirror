import React, { type FC, type ReactNode, useState } from 'react';

import Banner from '@atlaskit/banner';
import Button from '@atlaskit/button/new';
import { Code } from '@atlaskit/code';
import Heading from '@atlaskit/heading';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Popup from '@atlaskit/popup';
import { Box, Inline, Stack, Text, xcss } from '@atlaskit/primitives';

import ModalInsidePopup from './testing-modal';
import { PopupDOM, PopupPortal } from './testing-nested';

const halfWidth = xcss({ width: '45%' });

type DefaultPopupProps = {
	title: string;
	role?: 'dialog';
	shouldRenderToParent?: boolean;
};

type ComponentInfoProps = {
	heading: string | ReactNode;
	titles?: {
		leftSide?: string | ReactNode;
		rightSide?: string | ReactNode;
	};
	descriptions?: {
		leftSide?: string;
		rightSide?: string;
	};
	components?: {
		leftSide?: string | ReactNode;
		rightSide?: string | ReactNode;
	};
	alerts?: {
		leftSide?: string | ReactNode;
		rightSide?: string | ReactNode;
	};
};

const sizedContentStyles = xcss({
	height: '280px',
	padding: 'space.400',
	alignItems: 'center',
	overflow: 'auto',
	textAlign: 'center',
	verticalAlign: 'center',
	display: 'flex',
	flexDirection: 'column',
});

const PopupContent = () => {
	return (
		<Box id="Popup-content" xcss={sizedContentStyles}>
			<p>Popup content</p>
			<Button>Button 1</Button>
			<Button>Button 2</Button>
		</Box>
	);
};

const DefaultPopup: FC<DefaultPopupProps> = ({ title, role, shouldRenderToParent }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			content={() => <PopupContent />}
			placement="bottom-start"
			trigger={(triggerProps) => (
				<Button {...triggerProps} onClick={() => setIsOpen(!isOpen)}>
					{isOpen ? 'Close' : 'Open'} {title}
				</Button>
			)}
			role={role}
			label={role ? 'Dialog example' : undefined}
			shouldRenderToParent={shouldRenderToParent}
		/>
	);
};

const ComponentInfo: FC<ComponentInfoProps> = ({
	heading,
	titles,
	descriptions,
	components,
	alerts,
}) => {
	return (
		<Box paddingBlock="space.200" paddingInline="space.600">
			<Inline alignInline="center">
				<Heading size="medium">{heading}</Heading>
			</Inline>
			<Box paddingBlockStart="space.200">
				<Inline spread="space-between">
					<Box xcss={halfWidth}>
						<Inline alignInline="center">
							<Heading size="small">When {titles?.leftSide}</Heading>
						</Inline>
						<Stack as="ul">
							{descriptions?.leftSide?.split('  ').map((row, i) =>
								row.length !== 0 ? (
									<li key={i}>
										<Text>{row}</Text>
									</li>
								) : null,
							)}
						</Stack>
						{alerts?.leftSide && (
							<Box paddingBlockStart="space.100">
								<Banner
									appearance="warning"
									icon={<WarningIcon label="Warning" secondaryColor="inherit" />}
								>
									{alerts?.leftSide}
								</Banner>
							</Box>
						)}
						<Box paddingBlockStart="space.100">
							<Inline alignInline="center">{components?.leftSide}</Inline>
						</Box>
					</Box>
					<Box xcss={halfWidth}>
						<Inline alignInline="center">
							<Heading size="small">When {titles?.rightSide}</Heading>
						</Inline>
						<Stack as="ul">
							{descriptions?.rightSide?.split('  ').map((row, i) =>
								row.length !== 0 ? (
									<li key={i}>
										<Text>{row}</Text>
									</li>
								) : null,
							)}
						</Stack>
						{alerts?.rightSide && (
							<Box paddingBlockStart="space.100">
								<Banner
									appearance="warning"
									icon={<WarningIcon label="Warning" secondaryColor="inherit" />}
								>
									{alerts?.rightSide}
								</Banner>
							</Box>
						)}
						<Box paddingBlockStart="space.100">
							<Inline alignInline="center">{components?.rightSide}</Inline>
						</Box>
					</Box>
				</Inline>
			</Box>
			<hr role="presentation" />
		</Box>
	);
};

const expectedPopupDialogMessage = `Clicking or pressing Space/Enter on the trigger should open Popup.  Focus should be trapped inside Popup.  Clicking outside or pressing Escape should close Popup.  If you click on a non-interactive item outside, the focus should move to the trigger.`;

const expectedPopupDefaultMessage = (shouldRenderToParent?: boolean) => {
	return `Clicking or pressing Space/Enter on trigger should open Popup.  Pressing Tab should move focus to the next interactive element inside Popup.  Pressing Shift + Tab should move focus to the previous interactive element inside Popup.  ${shouldRenderToParent ? 'Pressing Tab on the last element should close Popup and move focus to the next interactive element after trigger.' : 'Pressing Tab on the last element inside Popup will close Popup and move focus outside body.'}  ${shouldRenderToParent ? 'On the first interactive element inside Popup pressing Shift+Tab should close Popup and set focus to the previous interactive element before trigger.' : 'On the first interactive element inside Popup pressing Shift+Tab should close Popup and set focus to the trigger.'}  Clicking outside or pressing Escape should close Popup.  If you click on a non-interactive item outside, the focus moves to the trigger.`;
};

const expectedPopupNestedMessage = (shouldRenderToParent?: boolean) => {
	return `Clicking or pressing Space/Enter on trigger should open Popup.  Pressing Tab should move focus to the next interactive element inside Popup.  Pressing Shift + Tab should move focus to the previous interactive element inside Popup.  ${shouldRenderToParent ? 'Pressing Tab on the last element should close Popup and move focus to the next interactive element after trigger.' : 'Pressing Tab on the last element inside Popup will close Popup and move focus outside body.'}  Clicking or pressing Space/Enter on the last element inside active Popup should open nested Popup.  ${shouldRenderToParent ? 'Pressing Tab on the last element should close Popup and move focus to the next interactive element after trigger.' : ''}  ${shouldRenderToParent ? 'On the first interactive element pressing Shift+Tab should close Popup and set focus to the previous interactive element before trigger.' : 'On the first interactive element pressing Shift+Tab should close Popup and set focus to the trigger.'}  Clicking outside should close all Popups.  Pressing Escape should close only active Popup.  If you click on a non-interactive item outside, the focus moves to the trigger.`;
};

const expectedModalInsidePopupMessage = (shouldRenderToParent?: boolean) => {
	return `Clicking or pressing Space/Enter on trigger should open Popup.  Pressing Tab should move focus to the next interactive element inside Popup.  Clicking or pressing Space/Enter on the last element inside active Popup should open ModalDialog and lock focus inside ModalDialog.  Clicking outside or pressing Escape should close ModalDialog.  A second click outside or pressing Escape should close Popup.  If you click on a non-interactive item outside, the focus moves to the trigger.`;
};

export default () => {
	return (
		<div>
			<ComponentInfo
				heading="Nested Popup"
				titles={{
					leftSide: <Code>shouldRenderToParent="false"</Code>,
					rightSide: <Code>shouldRenderToParent="true"</Code>,
				}}
				descriptions={{
					leftSide: expectedPopupNestedMessage(),
					rightSide: expectedPopupNestedMessage(true),
				}}
				components={{
					leftSide: <PopupPortal title="Nested Popup Portal" />,
					rightSide: <PopupDOM title="Nested Popup DOM" />,
				}}
				alerts={{
					leftSide:
						'Pressing Tab on the last element will close Popup and move focus outside body.',
					rightSide: 'We have incorrect placement behaviour.',
				}}
			/>

			<ComponentInfo
				heading="Default Popup"
				titles={{
					leftSide: <Code>shouldRenderToParent="false"</Code>,
					rightSide: <Code>shouldRenderToParent="true"</Code>,
				}}
				descriptions={{
					leftSide: expectedPopupDefaultMessage(),
					rightSide: expectedPopupDefaultMessage(true),
				}}
				components={{
					leftSide: <DefaultPopup title="Popup Portal" />,
					rightSide: <DefaultPopup shouldRenderToParent title="Popup DOM" />,
				}}
				alerts={{
					leftSide:
						'Pressing Tab on the last element will close Popup and move focus outside body.',
				}}
			/>

			<ComponentInfo
				heading={
					<Box>
						Popup with <Code>role="dialog"</Code>
					</Box>
				}
				titles={{
					leftSide: <Code>shouldRenderToParent="false"</Code>,
					rightSide: <Code>shouldRenderToParent="true"</Code>,
				}}
				descriptions={{
					leftSide: expectedPopupDialogMessage,
					rightSide: expectedPopupDialogMessage,
				}}
				components={{
					leftSide: <DefaultPopup title="Dialog" role="dialog" />,
					rightSide: <DefaultPopup shouldRenderToParent title="Dialog" role="dialog" />,
				}}
			/>

			<ComponentInfo
				heading={
					<Box>
						<Code>ModalDialog</Code> inside Popup
					</Box>
				}
				titles={{
					leftSide: <Code>shouldRenderToParent="false"</Code>,
					rightSide: <Code>shouldRenderToParent="true"</Code>,
				}}
				descriptions={{
					leftSide: expectedModalInsidePopupMessage(),
					rightSide: expectedModalInsidePopupMessage(),
				}}
				components={{
					leftSide: <ModalInsidePopup />,
					rightSide: <ModalInsidePopup shouldRenderToParent />,
				}}
				alerts={{
					leftSide: '',
				}}
			/>
		</div>
	);
};
