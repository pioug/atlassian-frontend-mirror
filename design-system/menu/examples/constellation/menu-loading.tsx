import React, { useEffect, useState } from 'react';

import Button from '@atlaskit/button/new';
import StarStarredIcon from '@atlaskit/icon/core/star-starred';
import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';
import ButtonItem from '@atlaskit/menu/button-item';
import HeadingItem from '@atlaskit/menu/heading-item';
import MenuGroup from '@atlaskit/menu/menu-group';
import Section from '@atlaskit/menu/section';
import SkeletonHeadingItem from '@atlaskit/menu/skeleton-heading-item';
import SkeletonItem from '@atlaskit/menu/skeleton-item';
import { type ButtonItemProps } from '@atlaskit/menu/types';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/compiled/box';
import { Stack } from '@atlaskit/primitives/compiled/stack';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- TODO: migrate to @atlaskit/primitives/compiled
import { xcss } from '@atlaskit/primitives/xcss';
import { token } from '@atlaskit/tokens';

import MenuGroupContainer from '../common/menu-group-container';
import Invision from '../icons/invision';
import Portfolio from '../icons/portfolio';
import Slack from '../icons/slack';
import Tempo from '../icons/tempo';

const iconContainerStyles = xcss({
	height: 'size.200',
	width: 'size.200',
	background: 'linear-gradient(180deg, #4E86EE 0%, #3562C1 100%), #4E86EE',
	borderRadius: 'radius.small',
});

const buttonContainerStyles = xcss({
	display: 'flex',
	justifyContent: 'center',
});

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
		<Stack space="space.200">
			<MenuGroupContainer>
				<MenuGroup>
					<Section aria-labelledby={isLoading ? '' : 'apps'}>
						<Heading aria-hidden id="apps" isLoading={isLoading}>
							Apps
						</Heading>
						<Item
							isLoading={isLoading}
							iconBefore={
								<Box xcss={iconContainerStyles}>
									<Portfolio color={token('color.icon.brand')} />
								</Box>
							}
							iconAfter={<StarStarredIcon color={token('color.icon.accent.orange')} label="" />}
						>
							Portfolio
						</Item>
						<Item
							isLoading={isLoading}
							iconBefore={<Tempo />}
							iconAfter={<StarStarredIcon color={token('color.icon.accent.orange')} label="" />}
						>
							Tempo timesheets
						</Item>
						<Item
							isLoading={isLoading}
							iconBefore={<Invision />}
							iconAfter={<StarUnstarredIcon label="" />}
						>
							Invision
						</Item>
						<Item isLoading={isLoading} iconBefore={<Slack />}>
							Slack
						</Item>
					</Section>
					<Section hasSeparator>
						<Item>Find new apps</Item>
						<Item>Manage your apps</Item>
					</Section>
				</MenuGroup>
			</MenuGroupContainer>
			<Box xcss={buttonContainerStyles}>
				<Button testId="toggle-loading" onClick={() => setRetryLoading(true)}>
					Reload
				</Button>
			</Box>
		</Stack>
	);
};
