import React from 'react';

import { LozengeDropdownTrigger } from '@atlaskit/lozenge';
import { Inline } from '@atlaskit/primitives/compiled';

export default (): React.JSX.Element => (
	<Inline space="space.100">
		<LozengeDropdownTrigger appearance="success">Success</LozengeDropdownTrigger>
		<LozengeDropdownTrigger appearance="warning">Warning</LozengeDropdownTrigger>
		<LozengeDropdownTrigger appearance="danger">Danger</LozengeDropdownTrigger>
		<LozengeDropdownTrigger appearance="information">Information</LozengeDropdownTrigger>
		<LozengeDropdownTrigger appearance="discovery">Discovery</LozengeDropdownTrigger>
		<LozengeDropdownTrigger appearance="neutral">Neutral</LozengeDropdownTrigger>
	</Inline>
);
