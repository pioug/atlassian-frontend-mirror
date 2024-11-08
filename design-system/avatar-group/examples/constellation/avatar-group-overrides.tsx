import React, { Fragment, useEffect, useRef, useState } from 'react';

import styled from '@emotion/styled';

import { type AppearanceType, type SizeType } from '@atlaskit/avatar';
import AvatarGroup from '@atlaskit/avatar-group';
import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import { getFreeToUseAvatarImage, RANDOM_USERS } from '../../examples-util/data';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ButtonGroup = styled.div({
	margin: token('space.100', '8px'),
	textAlign: 'center',
});

const INITIAL_NUMBER_VISIBLE_AVATARS = 8;

const AvatarGroupOverridesExample = () => {
	const lastAvatarItemRef = useRef<HTMLElement>(null);
	const [range, setRange] = useState(INITIAL_NUMBER_VISIBLE_AVATARS);
	const data = RANDOM_USERS.slice(0, range).map((d, i) => ({
		key: d.email,
		name: d.name,
		href: '#',
		appearance: 'circle' as AppearanceType,
		size: 'medium' as SizeType,
		src: getFreeToUseAvatarImage(i),
	}));

	useEffect(() => {
		lastAvatarItemRef.current?.focus();
	}, [range]);

	return (
		<AvatarGroup
			testId="overrides"
			appearance="stack"
			data={data}
			size="large"
			// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
			overrides={{
				AvatarGroupItem: {
					render: (Component, props, index) =>
						index === data.length - 1 ? (
							<Fragment key={`${index}-overridden`}>
								<Component {...props} key={index} ref={lastAvatarItemRef} />
								<ButtonGroup data-testid="load-more-actions">
									<Button
										testId="load-more"
										isDisabled={range >= RANDOM_USERS.length}
										onClick={() => {
											setRange(range + 1);
										}}
									>
										Load more users
									</Button>
								</ButtonGroup>
							</Fragment>
						) : (
							<Component {...props} key={index} />
						),
				},
			}}
		/>
	);
};

export default AvatarGroupOverridesExample;
