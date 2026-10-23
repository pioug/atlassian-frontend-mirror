import React, { useEffect, useRef, useState } from 'react';

import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import Button from '@atlaskit/button/default/button';
import { Main } from '@atlaskit/navigation-system/layout/main';
import {
	type localPanelWidthVar,
	PanelLayout,
} from '@atlaskit/navigation-system/layout/panel-layout';
import { Root } from '@atlaskit/navigation-system/layout/root';

const layout = (
	<Root UNSAFE_dangerouslyHoistSlotSizes>
		<Main>
			<PanelLayout
				isPanelOpen
				defaultPanelWidth={400}
				panelWidth={600}
				panel="Preview content"
				testId="ssr-layout"
			>
				Main content
			</PanelLayout>
		</Main>
	</Root>
);

/**
 * Server markup is deliberately left unhydrated until requested, for geometry regression tests.
 */
export default function PanelLayoutSsrExample(): JSX.Element {
	const [html] = useState(() => renderToString(layout));
	const container = useRef<HTMLDivElement | null>(null);
	const root = useRef<ReturnType<typeof hydrateRoot>>();
	const [hydrated, setHydrated] = useState(false);
	useEffect(() => () => root.current?.unmount(), []);
	return (
		<>
			<div
				data-testid="panel-width-offset"
				style={{ width: `var(${'--n_localPanelWidth' satisfies typeof localPanelWidthVar}, 0px)` }}
			/>
			<Button
				isDisabled={hydrated}
				onClick={() => {
					if (container.current) {
						root.current = hydrateRoot(container.current, layout);
						setHydrated(true);
					}
				}}
			>
				Hydrate layout
			</Button>
			<div ref={container} dangerouslySetInnerHTML={{ __html: html }} />
		</>
	);
}
