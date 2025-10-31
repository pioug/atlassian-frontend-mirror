import React from 'react';

import Button from '@atlaskit/button/new';
import { AutoDismissFlag, FlagGroup } from '@atlaskit/flag';
import SuccessIcon from '@atlaskit/icon/core/status-success';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const AutoDismissFlagActionsExample = () => {
	const [flags, setFlags] = React.useState<Array<number>>([]);

	const addFlag = () => {
		const newFlagId = flags.length + 1;
		const newFlags = flags.slice();
		newFlags.splice(0, 0, newFlagId);

		setFlags(newFlags);
	};

	const handleDismiss = () => {
		setFlags(flags.slice(1));
	};

	return (
		<Box>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<p style={{ padding: token('space.200') }}>
				<Button appearance="primary" onClick={addFlag}>
					Add flag
				</Button>
			</p>
			<FlagGroup onDismissed={handleDismiss}>
				{flags.map((flagId) => {
					return (
						<AutoDismissFlag
							id={flagId}
							icon={<SuccessIcon label="Success" color={token('color.icon.information')} />}
							key={flagId}
							title={`#${flagId} Hola`}
							description="I will auto dismiss after 8 seconds"
							actions={[
								{
									content: 'with onClick',
									onClick: () => {
										console.log('flag action clicked');
									},
								},
								{
									content: 'with href',
									href: 'https://atlaskit.atlassian.com/',
									target: '_blank',
								},
							]}
						/>
					);
				})}
			</FlagGroup>
		</Box>
	);
};

export default AutoDismissFlagActionsExample;
