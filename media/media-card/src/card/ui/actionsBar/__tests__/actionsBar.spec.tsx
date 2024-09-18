import React from 'react';
import { shallow, mount } from 'enzyme';
import DeleteIcon from '@atlaskit/icon/core/migration/delete--trash';
import DownloadIcon from '@atlaskit/icon/core/migration/download';
import EditIcon from '@atlaskit/icon/core/migration/edit';

import { type CardAction } from '../../../actions';

import { ActionsBar } from '../actionsBar';
import { CardActionsView } from '../cardActions';
import { ActionsBarWrapper } from '../actionsBarWrapper';

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
		const component = shallow(<ActionsBar actions={[]} />);
		expect(component.find(ActionsBarWrapper)).toHaveLength(0);
		expect(component.find(CardActionsView)).toHaveLength(0);
	});

	it('will render if there are actions', () => {
		const component = mount(<ActionsBar actions={[deleteAction, downloadAction, replaceAction]} />);
		expect(component.find(ActionsBarWrapper)).toHaveLength(1);
		expect(component.find(CardActionsView)).toHaveLength(1);
	});
});
