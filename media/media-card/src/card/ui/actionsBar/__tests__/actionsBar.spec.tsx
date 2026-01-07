import React from 'react';
import { screen, render } from '@testing-library/react';
import DeleteIcon from '@atlaskit/icon/core/delete';
import DownloadIcon from '@atlaskit/icon/core/download';
import EditIcon from '@atlaskit/icon/core/edit';
import userEvent from '@testing-library/user-event';

import { type CardAction } from '../../../actions';

import { ActionsBar } from '../actionsBar';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('ActionsBar', () => {
	const deleteAction: CardAction = {
		label: 'Delete',
		handler: jest.fn(),
		icon: <DeleteIcon color="currentColor" spacing="spacious" label="delete-icon" />,
	};
	const downloadAction: CardAction = {
		label: 'Download',
		handler: jest.fn(),
		icon: <DownloadIcon color="currentColor" spacing="spacious" label="download-icon" />,
	};
	const replaceAction: CardAction = {
		label: 'Replace',
		handler: jest.fn(),
		icon: <EditIcon color="currentColor" spacing="spacious" label="replace-icon" />,
	};

	it('will not render on empty actions', () => {
		render(<ActionsBar actions={[]} />);
		expect(screen.queryByTestId('actionsBarWrapper')).not.toBeInTheDocument();
	});

	it('will render if there are actions', async () => {
		render(<ActionsBar actions={[deleteAction, downloadAction, replaceAction]} />);
		expect(await screen.findByTestId('actionsBarWrapper')).toBeInTheDocument();
	});

	it('should prevent outer on click handler to be called', async () => {
		const user = userEvent.setup();
		const onOuterClick = jest.fn();

		render(
			<div id="outer" onClick={onOuterClick}>
				<ActionsBar actions={[deleteAction, downloadAction, replaceAction]} />
			</div>,
		);

		const actionsWrapper = await screen.findByTestId('actionsBarWrapper');
		expect(await screen.findByTestId('actionsBarWrapper')).toBeInTheDocument();
		const someAction = actionsWrapper.querySelector('button');

		if (!someAction) {
			throw new Error('Action Element not found (button)');
		}

		user.click(someAction);

		expect(onOuterClick).not.toHaveBeenCalled();
	});
});
