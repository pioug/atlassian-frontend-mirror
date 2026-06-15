import React, { useRef, useState } from 'react';

import Button from '@atlaskit/button/new';
import Flag, { FlagGroup } from '@atlaskit/flag';
import Info from '@atlaskit/icon/core/status-information';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

/**
 * Test fixture for the `Flag` top-layer focus contract.
 * See `__tests__/playwright/top-layer-focus.spec.tsx` for the asserted contract.
 */
export default function TestingTopLayerFocus(): React.ReactNode {
	const [flags, setFlags] = useState<number[]>([]);
	const nextId = useRef(0);

	function addFlag() {
		nextId.current += 1;
		setFlags((current) => [nextId.current, ...current]);
	}

	function dismissFlag() {
		setFlags((current) => current.slice(1));
	}

	return (
		<Box padding="space.200">
			<Stack space="space.200">
				<label htmlFor="external-input">External input</label>
				<input id="external-input" data-testid="external-input" type="text" />

				<Button testId="add-flag-trigger" onClick={addFlag}>
					Show flag
				</Button>

				<FlagGroup onDismissed={dismissFlag}>
					{flags.map((id) => (
						<Flag
							id={`flag-${id}`}
							testId={`flag-${id}`}
							icon={<Info label="Info" color={token('color.icon.information')} />}
							title={`Flag ${id}`}
							description="An informational flag."
							key={id}
						/>
					))}
				</FlagGroup>
			</Stack>
		</Box>
	);
}
