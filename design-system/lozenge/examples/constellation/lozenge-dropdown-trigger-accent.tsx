import React from 'react';

import { LozengeDropdownTrigger } from '@atlaskit/lozenge';
import { Inline } from '@atlaskit/primitives/compiled';

export default (): React.JSX.Element => (
	<Inline space="space.100">
		<LozengeDropdownTrigger appearance="accent-red">Red</LozengeDropdownTrigger>
		<LozengeDropdownTrigger appearance="accent-orange">Orange</LozengeDropdownTrigger>
		<LozengeDropdownTrigger appearance="accent-yellow">Yellow</LozengeDropdownTrigger>
		<LozengeDropdownTrigger appearance="accent-lime">Lime</LozengeDropdownTrigger>
		<LozengeDropdownTrigger appearance="accent-green">Green</LozengeDropdownTrigger>
		<LozengeDropdownTrigger appearance="accent-teal">Teal</LozengeDropdownTrigger>
		<LozengeDropdownTrigger appearance="accent-blue">Blue</LozengeDropdownTrigger>
		<LozengeDropdownTrigger appearance="accent-purple">Purple</LozengeDropdownTrigger>
		<LozengeDropdownTrigger appearance="accent-magenta">Magenta</LozengeDropdownTrigger>
		<LozengeDropdownTrigger appearance="accent-gray">Gray</LozengeDropdownTrigger>
	</Inline>
);
