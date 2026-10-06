import React from 'react';

import { Popup } from '@atlaskit/popup/popup';
import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { SideNavPanelSplitter } from '../../panel-splitter/side-nav-panel-splitter';
import { Root } from '../../root';
import { SideNav } from '../../side-nav/side-nav';
import { TopNav } from '../../top-nav/top-nav';
import { TopNavEnd } from '../../top-nav/top-nav-end';

it.each([false, true])(
	'should protect a persistent popup from the full-height side nav splitter (top layer: %s)',
	(isTopLayerEnabled) => {
		passGate('platform-dst-chat-panel-layout');
		passGate('navx-full-height-sidebar');
		(isTopLayerEnabled ? passGate : failGate)('platform-dst-top-layer');
		const { rerenderWith } = setupComponent();
		expect(screen.getByTestId('panel-splitter')).toBeInTheDocument();
		rerenderWith({ isOpen: true });
		expect(screen.getByRole('dialog', { name: 'Persistent popup' })).toBeInTheDocument();
		expect(screen.queryByTestId('panel-splitter')).not.toBeInTheDocument();
		rerenderWith({ isOpen: false });
		expect(screen.getByTestId('panel-splitter')).toBeInTheDocument();
	},
);

function PersistentPopupLayout({ isOpen = false }: { isOpen?: boolean }) {
	return (
		<Root>
			<TopNav>
				<TopNavEnd
					persistentItems={
						<div role="list">
							<div role="listitem">
								<Popup
									shouldRenderToParent
									isOpen={isOpen}
									role="dialog"
									label="Persistent popup"
									content={() => <div>Popup content</div>}
									trigger={({ ref }) => <button ref={ref}>Persistent trigger</button>}
								/>
							</div>
						</div>
					}
				>
					{null}
				</TopNavEnd>
			</TopNav>
			<SideNav>
				<SideNavPanelSplitter label="Resize side navigation" testId="panel-splitter" />
			</SideNav>
		</Root>
	);
}

function setupComponent(props: React.ComponentProps<typeof PersistentPopupLayout> = {}) {
	const view = render(<PersistentPopupLayout {...props} />);
	return {
		...view,
		rerenderWith: (nextProps: React.ComponentProps<typeof PersistentPopupLayout>) =>
			view.rerender(<PersistentPopupLayout {...nextProps} />),
	};
}
