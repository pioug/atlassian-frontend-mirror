import React, { useEffect, useState } from 'react';

import Button from '@atlaskit/button/new';
import StarStarredIcon from '@atlaskit/icon/core/star-starred';
import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';
import {
	ButtonItem,
	type ButtonItemProps,
	HeadingItem,
	MenuGroup,
	Section,
	SkeletonHeadingItem,
	SkeletonItem,
} from '@atlaskit/menu';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Stack } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import MenuGroupContainer from './common/menu-group-container';
import Invision from './icons/invision';
import Portfolio from './icons/portfolio';
import Slack from './icons/slack';
import Tempo from './icons/tempo';

const Item = ({ isLoading, ...props }: ButtonItemProps & { isLoading?: boolean }) => {
	if (isLoading) {
		return <SkeletonItem hasIcon isShimmering />;
	}

	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
	return <ButtonItem {...props} />;
};

const Heading = ({ isLoading, ...props }: any) => {
	if (isLoading) {
		return <SkeletonHeadingItem isShimmering />;
	}

	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
	return <HeadingItem {...props} />;
};

export default (): React.JSX.Element => {
	const [isLoading, setIsLoading] = useState(true);
	const [retryLoading, setRetryLoading] = useState(true);

	useEffect(() => {
		if (!retryLoading) {
			return;
		}

		setIsLoading(true);

		setTimeout(() => {
			setRetryLoading(false);
			setIsLoading(false);
		}, 1500);
	}, [retryLoading]);

	return (
		<Stack space={'space.100'}>
			<MenuGroupContainer>
				<MenuGroup>
					<Section aria-labelledby={isLoading ? '' : 'apps'}>
						<Heading aria-hidden id="apps" isLoading={isLoading}>
							Apps
						</Heading>
						<Item
							isLoading={isLoading}
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
									<Portfolio color={token('color.icon.brand')} aria-label="" />
								</div>
							}
							iconAfter={<StarStarredIcon color={token('color.icon.warning')} label="" />}
						>
							Portfolio
						</Item>
						<Item
							isLoading={isLoading}
							iconBefore={<Tempo aria-label="" />}
							iconAfter={<StarStarredIcon color={token('color.icon.warning')} label="" />}
						>
							Tempo timesheets
						</Item>
						<Item
							isLoading={isLoading}
							iconBefore={<Invision aria-label="" />}
							iconAfter={<StarUnstarredIcon label="" />}
						>
							Invision
						</Item>
						<Item isLoading={isLoading} iconBefore={<Slack aria-label="" />}>
							Slack
						</Item>
					</Section>
					<Section hasSeparator>
						<Item>Find new apps</Item>
						<Item>Manage your apps</Item>
					</Section>
				</MenuGroup>
			</MenuGroupContainer>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ textAlign: 'center' }}>
				<Button testId="toggle-loading" onClick={() => setRetryLoading(true)}>
					Reload
				</Button>
			</div>
		</Stack>
	);
};
