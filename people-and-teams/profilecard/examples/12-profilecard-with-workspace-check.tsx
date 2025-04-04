import React, { useCallback, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import Flag, { FlagGroup, type FlagProps } from '@atlaskit/flag';
import { token } from '@atlaskit/tokens';

import ProfileCardResourced from '../src';
import ProfileCardTrigger from '../src/components/User';

import ExampleWrapper from './helper/example-wrapper';
import { getMockProfileClient } from './helper/util';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Wrap = styled.div({
	marginBottom: token('space.250', '20px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const MainStage = styled.div({
	margin: token('space.200', '16px'),
});

export default function Example() {
	const [flags, setFlags] = useState<Array<FlagProps>>([]);

	const addFlag = (flag: FlagProps) => {
		setFlags((current) => [flag, ...current]);
	};

	const dismissFlag = useCallback(
		(id: string | number) => {
			setFlags((current) => current.filter((flag) => flag.id !== id));
		},
		[setFlags],
	);

	const mockClient = getMockProfileClient(
		10,
		0,
		{},
		{
			gatewayGraphqlUrl: 'https://api-private.stg.atlassian.com/graphql',
			productIdentifier: 'test',
			cloudId: 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
		},
	);

	const defaultProps = {
		cloudId: 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
		resourceClient: mockClient,
		actions: [
			{
				label: 'View profile',
				id: 'view-profile',
				callback: () => {},
			},
		],
	};

	return (
		<ExampleWrapper>
			<MainStage>
				<Wrap>
					<ProfileCardResourced
						{...defaultProps}
						userId="655363:3ddf0886-bc87-42aa-b1ba-32e4991e99d8"
						addFlag={addFlag}
					/>
				</Wrap>
				<Wrap>
					<ProfileCardTrigger
						{...defaultProps}
						userId="655363:3ddf0886-bc87-42aa-b1ba-32e4991e99d8"
						addFlag={addFlag}
					>
						<strong>hover over me</strong>
					</ProfileCardTrigger>
				</Wrap>
				<FlagGroup onDismissed={dismissFlag}>
					{flags.map((flag) => (
						<Flag {...flag} />
					))}
				</FlagGroup>
			</MainStage>
		</ExampleWrapper>
	);
}
