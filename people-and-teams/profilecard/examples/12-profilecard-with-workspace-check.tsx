import React, { useCallback, useState } from 'react';

import { cssMap } from '@atlaskit/css';
import Flag, { FlagGroup, type FlagProps } from '@atlaskit/flag';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import ProfileCardResourced from '../src';
import ProfileCardTrigger from '../src/components/User';

import ExampleWrapper from './helper/example-wrapper';
import { MainStage } from './helper/main-stage';
import { getMockProfileClient } from './helper/util';

export const Wrap = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
	return <Box xcss={styles.wrap}>{children}</Box>;
};

const styles = cssMap({
	wrap: {
		marginBottom: token('space.250', '20px'),
	},
});

export default function Example(): React.JSX.Element {
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
