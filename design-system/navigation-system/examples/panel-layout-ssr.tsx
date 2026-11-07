import React, { type ReactNode, useEffect, useRef, useState } from 'react';

import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import Button from '@atlaskit/button/default/button';
import { ChatPanel } from '@atlaskit/navigation-system/layout/chat-panel';
import { Main } from '@atlaskit/navigation-system/layout/main';
import {
	type localPanelWidthVar,
	PanelLayout,
} from '@atlaskit/navigation-system/layout/panel-layout';
import { Root } from '@atlaskit/navigation-system/layout/root';
import { SideNav } from '@atlaskit/navigation-system/layout/side-nav';

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
export function SsrLayoutFixture({ layout }: { layout: ReactNode }): JSX.Element {
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

export default function PanelLayoutSsrExample(): JSX.Element {
	return <SsrLayoutFixture layout={layout} />;
}

export function AllOpenPanelLayoutSsrExample(): JSX.Element {
	return (
		<SsrLayoutFixture
			layout={
				<Root>
					<SideNav testId="ssr-side-nav">Navigation</SideNav>
					<Main>
						<PanelLayout isPanelOpen panel="Preview content" testId="ssr-layout">
							Main content
						</PanelLayout>
					</Main>
					<ChatPanel testId="ssr-chat" onClose={() => undefined}>
						Chat content
					</ChatPanel>
				</Root>
			}
		/>
	);
}
