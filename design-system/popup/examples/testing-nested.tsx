/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import ArrowRight from '@atlaskit/icon/glyph/arrow-right';
import MenuIcon from '@atlaskit/icon/glyph/menu';
import { ButtonItem, PopupMenuGroup, Section } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';

const styles = css({ display: 'flex', gap: '16px' });
const NestedPopup = ({ shouldRenderToParent }: { shouldRenderToParent?: boolean }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<PopupMenuGroup onClick={(e) => e.stopPropagation()}>
			<Section title="Project actions">
				<ButtonItem>Create project</ButtonItem>
				<ButtonItem>View all projects</ButtonItem>
			</Section>
			<Section title="More project actions" hasSeparator>
				<Popup
					isOpen={isOpen}
					placement="right-start"
					onClose={() => setIsOpen(false)}
					content={() => <NestedPopup shouldRenderToParent={shouldRenderToParent} />}
					shouldRenderToParent={shouldRenderToParent}
					trigger={(triggerProps) => (
						<ButtonItem
							{...triggerProps}
							isSelected={isOpen}
							onClick={() => setIsOpen(true)}
							iconAfter={<ArrowRight label="" />}
						>
							More actions
						</ButtonItem>
					)}
				/>
			</Section>
		</PopupMenuGroup>
	);
};

export const PopupPortal = ({ title }: { title: string }) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Popup
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			content={() => <NestedPopup />}
			placement="bottom-start"
			// eslint-disable-next-line @atlaskit/design-system/use-should-render-to-parent
			shouldRenderToParent={false}
			trigger={(triggerProps) => (
				<Button
					{...triggerProps}
					iconBefore={MenuIcon}
					isSelected={isOpen}
					onClick={() => setIsOpen(!isOpen)}
				>
					{isOpen ? 'Close' : 'Open'} {title}
				</Button>
			)}
		/>
	);
};

export const PopupDOM = ({ title }: { title: string }) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Popup
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			content={() => <NestedPopup shouldRenderToParent />}
			placement="bottom-start"
			// eslint-disable-next-line @atlaskit/design-system/use-should-render-to-parent
			shouldRenderToParent={false}
			trigger={(triggerProps) => (
				<Button
					{...triggerProps}
					iconBefore={MenuIcon}
					isSelected={isOpen}
					onClick={() => setIsOpen(!isOpen)}
				>
					{isOpen ? 'Close' : 'Open'} {title}
				</Button>
			)}
		/>
	);
};

export default () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenDOM, setIsOpenDOM] = useState(false);

	return (
		<div css={styles}>
			<Popup
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				content={() => <NestedPopup shouldRenderToParent={false} />}
				placement="bottom-start"
				// eslint-disable-next-line @atlaskit/design-system/use-should-render-to-parent
				shouldRenderToParent={false}
				trigger={(triggerProps) => (
					<Button
						{...triggerProps}
						iconBefore={MenuIcon}
						isSelected={isOpen}
						onClick={() => setIsOpen(!isOpen)}
					>
						Nested Portal
					</Button>
				)}
			/>
			<Popup
				isOpen={isOpenDOM}
				onClose={() => setIsOpenDOM(false)}
				content={() => <NestedPopup shouldRenderToParent />}
				placement="bottom-start"
				shouldRenderToParent
				trigger={(triggerProps) => (
					<Button
						{...triggerProps}
						iconBefore={MenuIcon}
						isSelected={isOpenDOM}
						onClick={() => setIsOpenDOM(!isOpenDOM)}
					>
						Nested DOM
					</Button>
				)}
			/>
		</div>
	);
};
