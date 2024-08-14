/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Heading from '@atlaskit/heading';

import SuccessContainer from './SuccessContainer';

export default () => (
	<SuccessContainer>
		<Heading size="xsmall">Thanks for your feedback</Heading>
	</SuccessContainer>
);
