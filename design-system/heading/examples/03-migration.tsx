import React, { Fragment } from 'react';

import { Grid } from '@atlaskit/primitives';

import Heading from '../src';

export default () => {
	return (
		<Fragment>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles -- Ignored via go/DSP-18766 */}
			<style>{`:root { --ds-font-family-heading: sans-serif; }`}</style>
			<Grid templateColumns="1fr 1fr" gap="space.100" alignItems="baseline">
				<Heading level="h900">h900</Heading>
				<Heading size="xxlarge">xxlarge</Heading>
				<Heading level="h800">h800</Heading>
				<Heading size="xlarge">xlarge</Heading>
				<Heading level="h700">h700</Heading>
				<Heading size="large">large</Heading>
				<Heading level="h600">h600</Heading>
				<Heading size="medium">medium</Heading>
				<Heading level="h500">h500</Heading>
				<Heading size="small">small</Heading>
				<Heading level="h400">h400</Heading>
				<Heading size="xsmall">xsmall</Heading>
				<Heading level="h300">h300</Heading>
				<Heading size="xxsmall">xxsmall</Heading>
				<Heading level="h200">h200</Heading>
				<span>No equivalent</span>
				<Heading level="h100">h100</Heading>
				<span>No equivalent</span>
			</Grid>
		</Fragment>
	);
};
