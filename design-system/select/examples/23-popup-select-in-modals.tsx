import React from 'react';
import ModalDialog, { ModalTransition, ModalBody } from '@atlaskit/modal-dialog';
import Drawer from '@atlaskit/drawer';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { PopupSelect } from '../src';

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

export default () => {
	const [isOpen, setIsOpen] = React.useState(false);
	const [type, setType] = React.useState('modal');

	const select = (
		<PopupSelect
			isSearchable={false}
			options={options}
			menuPlacement="bottom"
			popperProps={{
				modifiers: [
					{ name: 'offset', options: { offset: [0, 8] } },
					{
						name: 'preventOverflow',
						enabled: false,
					},
				],
			}}
			target={({ ref }) => <Button ref={ref}>Choose</Button>}
		/>
	);

	return (
		<>
			<ButtonGroup label="Choose an option">
				<Button isSelected={type === 'modal'} onClick={() => setType('modal')}>
					Modal
				</Button>
				<Button isSelected={type === 'drawer'} onClick={() => setType('drawer')}>
					Drawer
				</Button>
				<Button appearance="primary" onClick={() => setIsOpen(true)}>
					Open
				</Button>
			</ButtonGroup>

			{select}

			{type === 'drawer' && (
				<Drawer label="Popup select inside Drawer" onClose={() => setIsOpen(false)} isOpen={isOpen}>
					{select}
				</Drawer>
			)}

			<ModalTransition>
				{type === 'modal' && isOpen && (
					<ModalDialog onClose={() => setIsOpen(false)}>
						<ModalBody>{select}</ModalBody>
					</ModalDialog>
				)}
			</ModalTransition>
		</>
	);
};
