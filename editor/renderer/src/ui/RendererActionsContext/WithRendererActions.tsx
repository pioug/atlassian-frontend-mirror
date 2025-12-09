import React, { type ReactNode } from 'react';
import { RendererActionsContextConsumer } from './index';
import type RendererActions from '../../actions/index';

interface WithRendererActionsProps {
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	render(actions: RendererActions): ReactNode | null;
}

export function WithRendererActions({ render }: WithRendererActionsProps): React.JSX.Element {
	return (
		<RendererActionsContextConsumer>{(actions) => render(actions)}</RendererActionsContextConsumer>
	);
}
