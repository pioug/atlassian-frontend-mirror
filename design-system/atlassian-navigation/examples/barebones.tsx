import React, { useState } from 'react';

import {
	AtlassianNavigation,
	PrimaryButton,
	PrimaryDropdownButton,
	ProductHome,
} from '@atlaskit/atlassian-navigation';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import { AtlassianIcon, AtlassianLogo } from '@atlaskit/logo';
import { ButtonItem, PopupMenuGroup, Section } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';
import { token } from '@atlaskit/tokens';

import appsSplash from './shared/assets/Apps4x.png';

const ProductHomeExample = () => <ProductHome icon={AtlassianIcon} logo={AtlassianLogo} />;

const PopupContents = () => (
	<PopupMenuGroup>
		<Section>
			<ButtonItem
				description="But what is an Atlassian, anyway?"
				iconBefore={
					<QuestionCircleIcon
						primaryColor={token('color.icon.information')}
						label=""
						size="medium"
					/>
				}
			>
				About
			</ButtonItem>
		</Section>
	</PopupMenuGroup>
);

const ExploreDropdown = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			shouldRenderToParent
			content={PopupContents}
			isOpen={isOpen}
			placement="bottom-start"
			onClose={() => setIsOpen(false)}
			trigger={(triggerProps) => (
				<PrimaryDropdownButton
					{...triggerProps}
					isSelected={isOpen}
					onClick={() => setIsOpen((prev) => !prev)}
				>
					Explore
				</PrimaryDropdownButton>
			)}
		/>
	);
};

export default () => (
	<div
		style={{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			paddingBottom: token('space.100', '8px'),
			border: `1px solid ${token('color.border')}`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			borderRadius: token('border.radius.100', '3px'),
		}}
	>
		<AtlassianNavigation
			label="site"
			primaryItems={[<PrimaryButton>Work items</PrimaryButton>, <ExploreDropdown />]}
			renderProductHome={ProductHomeExample}
		/>

		<img
			src={appsSplash}
			alt=""
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				display: 'block',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				margin: '0 auto',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				maxWidth: '800px',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				width: '100%',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				boxSizing: 'border-box',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				padding: '60px 100px',
			}}
		/>
	</div>
);
