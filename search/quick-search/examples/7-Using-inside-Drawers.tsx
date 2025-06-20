// About the issue:
// > If you use the old drawer and add it into the new one it will work properly
// > but using @atlaskit/drawer it's not working properly

import React from 'react';
import { AkSearchDrawer } from '@atlaskit/navigation';
import Drawer from '@atlaskit/drawer';
import ArrowLeftIcon from '@atlaskit/icon/core/migration/arrow-left';
import BasicQuickSearch from './utils/BasicQuickSearch';
import { token } from '@atlaskit/tokens';

type State = {
	isDrawerOpen: boolean;
	shouldUnmountOnExit: boolean;
	shouldRenderNewDrawer: boolean;
};

export default class IssueUsingDrawers extends React.Component<any, State> {
	state = {
		isDrawerOpen: false,
		shouldUnmountOnExit: true,
		shouldRenderNewDrawer: true,
	};

	quickSearchRef: any;

	openDrawer = () => {
		this.setState({
			isDrawerOpen: true,
		});
		if (this.quickSearchRef && typeof this.quickSearchRef.focusSearchInput === 'function') {
			this.quickSearchRef.focusSearchInput();
		}
	};

	closeDrawer = () =>
		this.setState({
			isDrawerOpen: false,
		});

	toggleUnmountBehaviour = () => {
		this.setState(({ shouldUnmountOnExit: shouldUnmountOnExitValue }) => ({
			shouldUnmountOnExit: !shouldUnmountOnExitValue,
		}));
	};

	toggleWrapper = () => {
		this.setState(({ shouldRenderNewDrawer: shouldRenderNewDrawerValue }) => ({
			shouldRenderNewDrawer: !shouldRenderNewDrawerValue,
			shouldUnmountOnExit: shouldRenderNewDrawerValue,
		}));
	};

	setQuickSearchRef = (ref: any) => {
		if (ref) {
			this.quickSearchRef = ref.quickSearchInnerRef;
		}
	};

	render() {
		const Wrapper = this.state.shouldRenderNewDrawer ? Drawer : AkSearchDrawer;

		return (
			<div style={{ padding: `${token('space.400', '32px')}` }}>
				<Wrapper
					onClose={this.closeDrawer}
					onBackButton={this.closeDrawer}
					backIcon={
						<ArrowLeftIcon
							color="currentColor"
							label="Back icon"
							LEGACY_size="medium"
							spacing="spacious"
						/>
					}
					isOpen={this.state.isDrawerOpen}
					key="search"
					primaryIcon={null}
					shouldUnmountOnExit={!this.state.shouldRenderNewDrawer && this.state.shouldUnmountOnExit}
				>
					<BasicQuickSearch ref={this.setQuickSearchRef} />
				</Wrapper>
				<button type="button" onClick={this.openDrawer}>
					Open drawer
				</button>
				<div style={{ marginTop: `${token('space.400', '32px')}` }}>
					<label htmlFor="wrapper-checkbox">
						{/* eslint-disable-next-line @atlaskit/design-system/no-html-checkbox */}
						<input
							id="wrapper-checkbox"
							type="checkbox"
							value={this.state.shouldRenderNewDrawer + ''}
							onChange={this.toggleWrapper}
						/>
						Use new Drawer component
					</label>
					<div
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							display: 'block',
							paddingTop: `${token('space.200', '16px')}`,
						}}
					>
						Quick search is wrapped using drawer component from{' '}
						<strong>{`${
							this.state.shouldRenderNewDrawer ? '@atlaskit/drawer' : '@atlaskit/navigation-next'
						}`}</strong>{' '}
					</div>
				</div>
				{this.state.shouldRenderNewDrawer && (
					<div style={{ marginTop: `${token('space.400', '32px')}` }}>
						<label htmlFor="checkbox">
							{/* eslint-disable-next-line @atlaskit/design-system/no-html-checkbox */}
							<input
								id="checkbox"
								type="checkbox"
								value={this.state.shouldUnmountOnExit + ''}
								onChange={this.toggleUnmountBehaviour}
							/>
							Toggle remounting of drawer contents on exit
						</label>
						<div
							style={{
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								display: 'block',
								paddingTop: `${token('space.200', '16px')}`,
							}}
						>
							Contents of the drawer will be{' '}
							<strong>{`${this.state.shouldUnmountOnExit ? 'discarded' : 'retained'}`}</strong> on
							closing the drawer
						</div>
					</div>
				)}
			</div>
		);
	}
}
