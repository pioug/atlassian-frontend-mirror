/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import type { ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

type SlotLabelProps = {
	children: ReactNode;
	isSmall?: boolean;
};

const slotLabelStyles = css({
	textAlign: 'center',
});

const SlotLabel = ({ children, isSmall = false }: SlotLabelProps) => {
	const Component = isSmall ? 'h4' : 'h3';
	return <Component css={slotLabelStyles}>{children}</Component>;
};

export default SlotLabel;
