import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import DeleteButton from '../../../plugins/table/ui/FloatingDeleteButton/DeleteButton';
import tableMessages from '../../../plugins/table/ui/messages';

describe('<DeleteButton />', () => {
  it('should fire the onMouseEnter callback', () => {
    const onMouseEnter = jest.fn();
    render(
      <IntlProvider locale="en">
        <DeleteButton
          removeLabel={tableMessages.removeColumns}
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
          removeLabel={tableMessages.removeColumns}
          onMouseLeave={onMouseLeave}
        />
      </IntlProvider>,
    );
    fireEvent.mouseLeave(screen.getByLabelText('Delete column'));
    expect(onMouseLeave).toHaveBeenCalled();
  });
});
