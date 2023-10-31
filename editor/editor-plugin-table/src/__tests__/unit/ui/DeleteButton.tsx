import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { tableMessages as messages } from '@atlaskit/editor-common/messages';

import DeleteButton from '../../../plugins/table/ui/FloatingDeleteButton/DeleteButton';

describe('<DeleteButton />', () => {
  it('should fire the onMouseEnter callback', () => {
    const onMouseEnter = jest.fn();
    render(
      <IntlProvider locale="en">
        <DeleteButton
          removeLabel={messages.removeColumns}
          onMouseEnter={onMouseEnter}
        />
      </IntlProvider>,
    );
    fireEvent.mouseEnter(screen.getByLabelText('Delete column'));
    expect(onMouseEnter).toHaveBeenCalled();
  });

  it('should fire the onMouseLeave callback', () => {
    const onMouseLeave = jest.fn();
    render(
      <IntlProvider locale="en">
        <DeleteButton
          removeLabel={messages.removeColumns}
          onMouseLeave={onMouseLeave}
        />
      </IntlProvider>,
    );
    fireEvent.mouseLeave(screen.getByLabelText('Delete column'));
    expect(onMouseLeave).toHaveBeenCalled();
  });
});
