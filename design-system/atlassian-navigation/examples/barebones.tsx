import React, { useState } from 'react';

import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import { AtlassianIcon, AtlassianLogo } from '@atlaskit/logo';
import { ButtonItem, PopupMenuGroup, Section } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';
// AFP-2532 TODO: Fix automatic suppressions below
import { borderRadius } from '@atlaskit/theme';
import { token } from '@atlaskit/tokens';

import { AtlassianNavigation, PrimaryButton, PrimaryDropdownButton, ProductHome } from '../src';

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
			// TODO Delete this comment after verifying space token -> previous value `8`
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			paddingBottom: token('space.100', '8px'),
			border: `1px solid ${token('color.border')}`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			borderRadius: borderRadius(),
		}}
	>
		<AtlassianNavigation
			label="site"
			primaryItems={[<PrimaryButton>Issues</PrimaryButton>, <ExploreDropdown />]}
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
