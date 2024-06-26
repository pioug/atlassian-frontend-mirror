import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { typography } from '../src';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
const Heading = styled.div<{ mixin: any }>((props) => props.mixin());

export default () => {
	return (
		<div>
			<Heading mixin={typography.h100}>h100</Heading>
			<Heading mixin={typography.h200}>h200</Heading>
			<Heading mixin={typography.h300}>h300</Heading>
			<Heading mixin={typography.h400}>h400</Heading>
			<Heading mixin={typography.h500}>h500</Heading>
			<Heading mixin={typography.h600}>h600</Heading>
			<Heading mixin={typography.h700}>h700</Heading>
			<Heading mixin={typography.h800}>h800</Heading>
			<Heading mixin={typography.h900}>h900</Heading>
		</div>
	);
};
