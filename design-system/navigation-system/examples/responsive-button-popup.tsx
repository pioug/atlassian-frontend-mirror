import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import AddIcon from '@atlaskit/icon/core/add';
import { TopNav } from '@atlaskit/navigation-system/layout/top-nav';
import { TopNavIconButton } from '@atlaskit/navigation-system/theming/top-nav-button';
import { ResponsiveTopNavButton } from '@atlaskit/navigation-system/top-nav-items/responsive-button';
import { Popup } from '@atlaskit/popup/popup';
import Textfield from '@atlaskit/textfield/text-field';

import { MockRoot } from './utils/mock-root';

export default function ResponsiveButtonPopup(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<MockRoot>
			<TopNav testId="popup-top-nav">
				<Popup
					isOpen={isOpen}
					shouldRenderToParent
					onClose={() => setIsOpen(false)}
					placement="bottom-start"
					role="dialog"
					label="Create item"
					content={() => (
						<>
							<Button>First action</Button>
							<Textfield aria-label="Item name" />
						</>
					)}
					trigger={(triggerProps) => (
						<ResponsiveTopNavButton
							{...triggerProps}
							testId="popup-trigger"
							iconButton={TopNavIconButton}
							icon={AddIcon}
							label="Create"
							onClick={() => setIsOpen((open) => !open)}
						/>
					)}
				/>
			</TopNav>
		</MockRoot>
	);
}
