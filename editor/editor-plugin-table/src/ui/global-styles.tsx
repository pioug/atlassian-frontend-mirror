/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles, @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { Global, jsx } from '@emotion/react';

import type { FeatureFlags } from '@atlaskit/editor-common/types';

import { tableStyles } from './common-styles';

export const GlobalStylesWrapper = ({
	featureFlags,
}: {
	featureFlags: FeatureFlags | undefined;
}) => {
	return <Global styles={tableStyles({ featureFlags })} />;
};
