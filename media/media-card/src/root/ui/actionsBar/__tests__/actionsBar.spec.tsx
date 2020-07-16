import React from 'react';
import { shallow, mount } from 'enzyme';
import DeleteIcon from '@atlaskit/icon/glyph/trash';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import EditIcon from '@atlaskit/icon/glyph/edit';

import { CardAction } from '../../../../actions';

import { ActionsBar } from '../actionsBar';
import { Wrapper } from '../styled';
import { CardActionsView } from '../../../../utils/cardActions';

describe('ActionsBar', () => {
  const deleteAction: CardAction = {
    label: 'Delete',
    handler: jest.fn(),
    icon: <DeleteIcon label="delete-icon" />,
  };
  const downloadAction: CardAction = {
    label: 'Download',
    handler: jest.fn(),
    icon: <DownloadIcon label="download-icon" />,
  };
  const replaceAction: CardAction = {
    label: 'Replace',
    handler: jest.fn(),
    icon: <EditIcon label="replace-icon" />,
  };

  it('will not render on empty actions', () => {
    const component = shallow(<ActionsBar actions={[]} />);
    expect(component.find(Wrapper)).toHaveLength(0);
    expect(component.find(CardActionsView)).toHaveLength(0);
  });

  it('will render if there are actions', () => {
    const component = mount(
      <ActionsBar actions={[deleteAction, downloadAction, replaceAction]} />,
    );
    expect(component.find(Wrapper)).toHaveLength(1);
    expect(component.find(CardActionsView)).toHaveLength(1);
  });
});
