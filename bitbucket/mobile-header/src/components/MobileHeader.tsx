import React, { Fragment, PureComponent, type ReactNode } from 'react';

import Button from '@atlaskit/button';
import MenuIcon from '@atlaskit/icon/core/migration/menu';

import * as styles from '../styled';

interface MobileHeaderProps {
	customMenu?: ReactNode;
	drawerState: 'navigation' | 'sidebar' | 'none' | string;
	menuIconLabel: string;
	navigation?: (isOpen: boolean) => ReactNode;
	onDrawerClose?: () => void;
	onNavigationOpen?: () => void;
	pageHeading: ReactNode;
	secondaryContent?: ReactNode;
	sidebar?: (isOpen: boolean) => ReactNode;
	topOffset?: number;
}

interface MobileHeaderState {
	isAnimatingNavigation: boolean;
	isAnimatingSidebar: boolean;
}

class MobileHeader extends PureComponent<MobileHeaderProps, MobileHeaderState> {
	state = {
		isAnimatingNavigation: false,
		isAnimatingSidebar: false,
	};

	static defaultProps = {
		topOffset: 0,
		pageHeading: '',
		menuIconLabel: 'Menu',
		drawerState: '',
	};

	UNSAFE_componentWillReceiveProps(nextProps: MobileHeaderProps) {
		if (nextProps.drawerState === 'none') {
			if (this.props.drawerState === 'navigation') {
				this.setState({ isAnimatingNavigation: true });
			} else if (this.props.drawerState === 'sidebar') {
				this.setState({ isAnimatingSidebar: true });
			}
		}
	}

	handleNavSlideFinish = () => {
		this.setState({ isAnimatingNavigation: false });
	};

	handleSidebarSlideFinish = () => {
		this.setState({ isAnimatingSidebar: false });
	};

	renderSlider = (
		isOpen: boolean,
		isAnimating: boolean,
		onTransitionEnd: ((event: React.TransitionEvent<HTMLDivElement>) => void) | undefined,
		side: string,
		renderFn?: (isOpen: boolean) => ReactNode,
		topOffset?: number,
	) => (
		<styles.MobileNavSlider
			isOpen={isOpen}
			onTransitionEnd={onTransitionEnd}
			side={side}
			topOffset={topOffset}
		>
			{(isOpen || isAnimating) && renderFn && renderFn(isOpen)}
		</styles.MobileNavSlider>
	);

	render() {
		const { isAnimatingNavigation, isAnimatingSidebar } = this.state;
		const { drawerState, menuIconLabel, customMenu, topOffset } = this.props;
		const isNavigationOpen = drawerState === 'navigation';
		const isSidebarOpen = drawerState === 'sidebar';

		const menu = customMenu || (
			<Button
				appearance="subtle"
				iconBefore={
					<MenuIcon
						label={menuIconLabel}
						LEGACY_size="large"
						color="currentColor"
						spacing="spacious"
					/>
				}
				onClick={this.props.onNavigationOpen}
			/>
		);

		return (
			<Fragment>
				<styles.MobilePageHeader>
					<styles.MobilePageHeaderContent topOffset={topOffset}>
						{menu}
						<styles.PageHeading>{this.props.pageHeading}</styles.PageHeading>
						{this.props.secondaryContent}
					</styles.MobilePageHeaderContent>
				</styles.MobilePageHeader>

				{this.renderSlider(
					isNavigationOpen,
					isAnimatingNavigation,
					this.handleNavSlideFinish,
					'left',
					this.props.navigation,
					topOffset,
				)}

				{this.renderSlider(
					isSidebarOpen,
					isAnimatingSidebar,
					this.handleSidebarSlideFinish,
					'right',
					this.props.sidebar,
					topOffset,
				)}

				{(isNavigationOpen || isSidebarOpen || isAnimatingNavigation || isAnimatingSidebar) && (
					<styles.FakeBlanket
						isOpen={isNavigationOpen || isSidebarOpen}
						onClick={this.props.onDrawerClose}
						data-testid="fake-blanket"
					/>
				)}
			</Fragment>
		);
	}
}

export default MobileHeader;
