/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { Component } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import Drawer from '@atlaskit/drawer';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';

interface State {
	isDrawerOpen: boolean;
}

export default class DrawersExample extends Component<{}, State> {
	state = {
		isDrawerOpen: true,
	};

	openDrawer = () =>
		this.setState({
			isDrawerOpen: true,
		});

	closeDrawer = () =>
		this.setState({
			isDrawerOpen: false,
		});

	render() {
		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ padding: '2rem' }}>
				<Drawer
					onClose={this.closeDrawer}
					isOpen={this.state.isDrawerOpen}
					width="wide"
					label="Drawer with fixed contents"
				>
					<div id="drawer-contents">
						<p id="paragraph">
							The drawer should not set a new stacking context by using a transform CSS property as
							this causes issues for fixed positioned elements such as @atlaskit/dropdown-menu.
						</p>
						{/* The position here is used by the withDropdown integration test. */}
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
						<div style={{ position: 'fixed', left: 100, top: 200 }}>
							<DropdownMenu<HTMLButtonElement>
								testId="dropdown"
								trigger={({ triggerRef, ...providedProps }) => (
									<Button id="trigger" ref={triggerRef} {...providedProps}>
										Choices
									</Button>
								)}
							>
								<DropdownItemGroup>
									<DropdownItem>Sydney</DropdownItem>
									<DropdownItem>Melbourne</DropdownItem>
								</DropdownItemGroup>
							</DropdownMenu>
						</div>
					</div>
				</Drawer>
				<Button type="button" onClick={this.openDrawer}>
					Open drawer
				</Button>
			</div>
		);
	}
}
