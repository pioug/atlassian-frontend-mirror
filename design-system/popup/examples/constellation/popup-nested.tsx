/** @jsx jsx */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import ArrowRight from '@atlaskit/icon/glyph/arrow-right';
import MenuIcon from '@atlaskit/icon/glyph/menu';
import { ButtonItem, MenuGroup, Section } from '@atlaskit/menu';

import Popup from '../../src';

const NestedPopup = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<MenuGroup maxWidth={800} minWidth={320} onClick={(e) => e.stopPropagation()}>
			<Section>
				<ButtonItem>Create project</ButtonItem>
				<ButtonItem>View all projects</ButtonItem>
			</Section>
			<Section hasSeparator>
				<Popup
					isOpen={isOpen}
					placement="right-start"
					onClose={() => setIsOpen(false)}
					content={() => <NestedPopup />}
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
		</MenuGroup>
	);
};

const PopupNestedExample = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			content={() => <NestedPopup />}
			placement="bottom-start"
			trigger={(triggerProps) => (
				<Button
					{...triggerProps}
					isSelected={isOpen}
					iconBefore={MenuIcon}
					onClick={() => setIsOpen(!isOpen)}
				>
					Menu
				</Button>
			)}
		/>
	);
};

export default PopupNestedExample;
