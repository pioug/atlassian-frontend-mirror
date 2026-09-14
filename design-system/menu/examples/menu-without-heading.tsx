import React from 'react';

import StarStarredIcon from '@atlaskit/icon/core/star-starred';
import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';
import ButtonItem from '@atlaskit/menu/button-item';
import MenuGroup from '@atlaskit/menu/menu-group';
import Section from '@atlaskit/menu/section';
import { token } from '@atlaskit/tokens';

import MenuGroupContainer from './common/menu-group-container';
import Invision from './icons/invision';
import Portfolio from './icons/portfolio';
import Slack from './icons/slack';
import Tempo from './icons/tempo';

export default (): React.JSX.Element => {
	return (
		<MenuGroupContainer>
			<MenuGroup>
				<Section>
					<ButtonItem
						iconBefore={
							<div
								style={{
									// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
									height: 24,
									// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
									width: 24,
									// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
									background: 'linear-gradient(180deg, #4E86EE 0%, #3562C1 100%), #4E86EE',
									// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
									borderRadius: 3,
								}}
							>
								<Portfolio color={token('color.icon.brand')} />
							</div>
						}
						iconAfter={<StarStarredIcon color={token('color.icon.warning')} label="" />}
					>
						Portfolio
					</ButtonItem>
					<ButtonItem
						iconBefore={<Tempo />}
						iconAfter={<StarStarredIcon color={token('color.icon.warning')} label="" />}
					>
						Tempo timesheets
					</ButtonItem>
					<ButtonItem iconBefore={<Invision />} iconAfter={<StarUnstarredIcon label="" />}>
						Invision
					</ButtonItem>
					<ButtonItem iconBefore={<Slack />}>Slack</ButtonItem>
				</Section>
				<Section hasSeparator>
					<ButtonItem>Find new apps</ButtonItem>
					<ButtonItem>Manage your apps</ButtonItem>
				</Section>
			</MenuGroup>
		</MenuGroupContainer>
	);
};
