import React, { Fragment } from 'react';

import Heading from '@atlaskit/heading';
import { Stack } from '@atlaskit/primitives/compiled';

export default () => {
	return (
		<Fragment>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles -- Ignored via go/DSP-18766 */}
			<style>{`:root { --ds-font-family-heading: sans-serif; }`}</style>
			<Stack space="space.100">
				<Heading size="xsmall">New size</Heading>
				<Heading size="xxlarge">xxlarge (replaces h900)</Heading>
				<Heading size="xlarge">xlarge (replaces h800)</Heading>
				<Heading size="large">large (replaces h700)</Heading>
				<Heading size="medium">medium (replaces h600)</Heading>
				<Heading size="small">small (replaces h500)</Heading>
				<Heading size="xsmall">xsmall (replaces h400)</Heading>
				<Heading size="xxsmall">xxsmall (replaces h300, h200, and h100)</Heading>
			</Stack>
		</Fragment>
	);
};
