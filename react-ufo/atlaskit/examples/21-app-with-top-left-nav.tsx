/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
/* eslint-disable @atlaskit/design-system/no-html-button */
/* eslint-disable @atlassian/a11y/no-noninteractive-element-to-interactive-role*/
import React, { useEffect, useState } from 'react';

import { css, jsx, keyframes } from '@compiled/react';

import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment from '@atlaskit/react-ufo/segment';
import traceUFOTransition from '@atlaskit/react-ufo/trace-transition';

// Define keyframes for spinner animation
const spinAnimation = keyframes({
	'0%': { transform: 'rotate(0deg)' },
	'100%': { transform: 'rotate(360deg)' },
});

// Define styles for the components
const appStyle = css({
	display: 'grid',
	gridTemplateRows: '50px 1fr',
	gridTemplateColumns: '350px 1fr',
	gridTemplateAreas: `
    "topNav topNav"
    "leftNav mainContent"
  `,
	height: '100vh',
	width: '100%',
});

const topNavStyle = css({
	backgroundColor: '#90CAF9', // Light Blue
	gridArea: 'topNav',
	height: '50px',
	display: 'flex',
	alignItems: 'center',
	padding: '0 20px',
});

const leftNavStyle = css({
	backgroundColor: '#A5D6A7', // Light Green
	gridArea: 'leftNav',
	width: '350px',
	height: '100%',
	padding: '20px',
});

const mainContentBaseStyle = css({
	gridArea: 'mainContent',
	padding: '20px',
	transition: 'background-color 0.3s ease-in-out',
	position: 'relative',
});

const mainContentInitialStyle = css({
	gridArea: 'mainContent',
	padding: '20px',
	transition: 'background-color 0.3s ease-in-out',
	position: 'relative',
	backgroundColor: '#FFCC80',
});

const loadingOverlayStyle = css({
	position: 'fixed',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '50px',
	height: '50px',
	backgroundColor: 'rgba(255, 255, 255, 0.9)',
	borderColor: '#ccc',
	borderStyle: 'solid',
	borderWidth: '2px',
	borderRadius: '8px',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	zIndex: 1000,
	boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
});

const loadingTextStyle = css({
	fontSize: '12px',
	fontWeight: 'bold',
	color: '#666',
	animation: `${spinAnimation} 1s linear infinite`,
});

const menuItemStyle = css({
	cursor: 'pointer',
	padding: '8px 0',
});

// Custom hook for visibility delay
const useDelayedVisibility = (delay: number) => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setVisible(true);
		}, delay);
		return () => clearTimeout(timer);
	}, [delay]);

	return visible;
};

// Component for top navigation
const TopNavigation = () => {
	const isVisible = useDelayedVisibility(500);

	if (!isVisible) {
		return <UFOLoadHold name="top-navigation" />;
	}

	return (
		<div data-testid="top-nav" css={topNavStyle}>
			<h2>Top Navigation</h2>
		</div>
	);
};

// Component for left navigation
const LeftNavigation = ({ onMenuItemClick }: { onMenuItemClick: (title: string) => void }) => {
	const isVisible = useDelayedVisibility(1000);

	const menuItems = ['dashboard', 'projects', 'tasks', 'reports', 'settings'];

	if (!isVisible) {
		return <UFOLoadHold name="left-navigation" />;
	}

	const handleItemClick = (item: string) => {
		onMenuItemClick(item);
	};

	const handleItemKeyDown = (event: React.KeyboardEvent, item: string) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onMenuItemClick(item);
		}
	};

	return (
		<div data-testid="left-nav" css={leftNavStyle}>
			<h2>Left Navigation</h2>
			<ul>
				{menuItems.map((item, index) => (
					<li
						key={index}
						css={menuItemStyle}
						onClick={() => handleItemClick(item)}
						onKeyDown={(event) => handleItemKeyDown(event, item)}
						// eslint-disable-next-line @atlassian/a11y/mouse-events-have-key-events
						onMouseEnter={(e) => {
							e.currentTarget.style.textDecoration = 'underline';
						}}
						// eslint-disable-next-line @atlassian/a11y/mouse-events-have-key-events
						onMouseLeave={(e) => {
							e.currentTarget.style.textDecoration = 'none';
						}}
						data-testid={`left-nav-item-${item}`}
						role="button"
						tabIndex={0}
					>
						{item}
					</li>
				))}
			</ul>
		</div>
	);
};

// Loading spinner component
const LoadingSpinner = () => {
	return (
		<div data-testid="loading-spinner" css={loadingOverlayStyle}>
			<div css={loadingTextStyle}>⟳</div>
		</div>
	);
};

const AdditionalHoldDelay = () => {
	const [isWaitingForFinish, setIsWaitingForFinish] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setIsWaitingForFinish(false);
		}, 200);
	}, []);

	return <UFOLoadHold name="additional-hold-delay" hold={isWaitingForFinish} />;
};

// Component for main content
const MainContent = ({
	selectedMenuItem,
	isLoading,
}: {
	selectedMenuItem: string | null;
	isLoading: boolean;
}) => {
	const isInitiallyVisible = useDelayedVisibility(1500);

	// Handle initial load
	if (!isInitiallyVisible) {
		return (
			<div css={mainContentInitialStyle}>
				<UFOLoadHold name="main-content" />
			</div>
		);
	}

	if (isLoading) {
		return (
			<>
				<UFOLoadHold name="content-transition" />
				<LoadingSpinner />
			</>
		);
	}

	// Handle menu navigation loading state
	return (
		<div
			data-testid={`main-content-${selectedMenuItem}`}
			key={selectedMenuItem}
			css={mainContentBaseStyle}
			style={{ backgroundColor: isLoading ? '#CCCCCC' : '#FFCC80' }}
		>
			<div>
				<div style={{ opacity: isLoading ? 0.5 : 1 }}>
					{selectedMenuItem ? (
						<div>
							<h2>{selectedMenuItem}</h2>
							<p>This is the content for the {selectedMenuItem} section.</p>
						</div>
					) : (
						<div>
							<h2>Main Content</h2>
							<p>This is the main content area of the application.</p>
							<p>It has a loading hold of 1500ms.</p>
							<p>Click on a menu item in the left navigation to view its content.</p>
						</div>
					)}
				</div>
				<AdditionalHoldDelay />
			</div>
		</div>
	);
};

// Main App component
export default function Example() {
	const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(null);
	const [isContentLoading, setIsContentLoading] = useState(false);

	const handleMenuItemClick = (title: string) => {
		// Trigger UFO transition with the menu item name
		traceUFOTransition(title);

		setIsContentLoading(true);

		// Simulate loading delay
		setTimeout(() => {
			setSelectedMenuItem(title);
			setIsContentLoading(false);
		}, 500);
	};

	return (
		<UFOSegment name="app-root">
			<div data-testid="main" css={appStyle}>
				<TopNavigation />
				<LeftNavigation onMenuItemClick={handleMenuItemClick} />
				<MainContent selectedMenuItem={selectedMenuItem} isLoading={isContentLoading} />
			</div>
		</UFOSegment>
	);
}
