import React from 'react';
import { render } from '@testing-library/react';
import FileChooser from '../../../../components/common/FileChooser';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

describe('File Chooser', () => {
  it('is displayed to the user', async () => {
    await render(<FileChooser label="click to upload" />);
    expect(await screen.findByText('click to upload')).toBeInTheDocument();
  });
  it('is disabled to the user', async () => {
    const onFileDialogOpen = jest.fn();

    await render(
      <FileChooser
        label="click to upload"
        isDisabled
        onClick={onFileDialogOpen}
      />,
    );

    const filePickerOpenButton = await screen.findByRole('button');
    expect(filePickerOpenButton).toHaveAttribute('disabled');

    userEvent.click(filePickerOpenButton);

    expect(onFileDialogOpen).not.toHaveBeenCalled();
  });
  it('open the file dialog and calls the onClick prop', async () => {
    const onFileDialogOpen = jest.fn();

    await render(
      <FileChooser label="click to upload" onClick={onFileDialogOpen} />,
    );

    const filePickerOpenButton = await screen.findByRole('button');
    userEvent.click(filePickerOpenButton);
    expect(onFileDialogOpen).toHaveBeenCalled();
  });
});
