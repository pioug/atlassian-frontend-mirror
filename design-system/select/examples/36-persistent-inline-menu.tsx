/**
 * @jsx jsx
 * @jsxRuntime classic
 */

import React, { useEffect, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import ButtonItem from '@atlaskit/menu/button-item';
import MenuGroup from '@atlaskit/menu/menu-group';
import Section from '@atlaskit/menu/section';
import { Popup } from '@atlaskit/popup/popup';
import Select from '@atlaskit/select/default';
import { token } from '@atlaskit/tokens';

const options = [
	{ label: 'Adelaide', value: 'adelaide' },
	{ label: 'Brisbane', value: 'brisbane' },
	{ label: 'Canberra', value: 'canberra' },
	{ label: 'Darwin', value: 'darwin' },
	{ label: 'Hobart', value: 'hobart' },
	{ label: 'Melbourne', value: 'melbourne' },
	{ label: 'Perth', value: 'perth' },
	{ label: 'Sydney', value: 'sydney' },
];

const styles = cssMap({
	examples: {
		display: 'flex',
		alignItems: 'start',
		gap: token('space.100'),
	},
	content: {
		boxSizing: 'border-box',
		minHeight: '320px',
		paddingBlock: token('space.050'),
		paddingInline: token('space.100'),
		width: '320px',
	},
});

type SelectPopupExampleProps = {
	label: string;
	isMulti?: boolean;
	isDelayed?: boolean;
	shouldCacheAfterLoad?: boolean;
};

function SelectPopupExample({
	label,
	isMulti = false,
	isDelayed = false,
	shouldCacheAfterLoad = false,
}: SelectPopupExampleProps): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoaded, setIsLoaded] = useState(!isDelayed);

	useEffect(() => {
		if (!isOpen || !isDelayed) {
			return;
		}

		const timeoutId = window.setTimeout(() => setIsLoaded(true), 1000);
		return () => window.clearTimeout(timeoutId);
	}, [isDelayed, isOpen]);

	const togglePopup = () => {
		if (!isOpen && (!shouldCacheAfterLoad || !isLoaded)) {
			setIsLoaded(!isDelayed);
		}
		setIsOpen((currentIsOpen) => !currentIsOpen);
	};

	return (
		<Popup
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			placement="bottom-start"
			role="dialog"
			label={label}
			content={() => (
				<div>
					{isLoaded ? (
						<MenuGroup>
							<Section>
								<div css={styles.content}>
									<Select
										autoFocus
										menuRenderMode="inline"
										isMulti={isMulti}
										label={label}
										options={options}
										placeholder="Search cities"
									/>
								</div>
							</Section>
							<Section hasSeparator>
								<ButtonItem>Apple</ButtonItem>
								<ButtonItem>Banana</ButtonItem>
							</Section>
						</MenuGroup>
					) : (
						<span>Loading select...</span>
					)}
				</div>
			)}
			trigger={(triggerProps) => (
				<Button {...triggerProps} isSelected={isOpen} onClick={togglePopup}>
					{label}
				</Button>
			)}
		/>
	);
}

export default function SelectInPopupExample(): React.JSX.Element {
	return (
		<div css={styles.examples}>
			<SelectPopupExample label="Single select" />
			<SelectPopupExample label="Multi-select" isMulti />
			<SelectPopupExample label="Delayed select" isDelayed />
			<SelectPopupExample label="Cached delayed select" isDelayed shouldCacheAfterLoad />
		</div>
	);
}
