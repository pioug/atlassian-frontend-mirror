import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { IntlShape, IntlProvider } from 'react-intl-next';

import ImageBorder, { ImageBorderProps } from '../../index';
import { messages } from '../../messages';
import ReactEditorViewContext from '../../../../../../create-editor/ReactEditorViewContext';

const intlMock = {
  formatMessage: (messageDescriptor: any) =>
    messageDescriptor && messageDescriptor.defaultMessage,
} as IntlShape;

const setup = (propsOverrides?: Partial<ImageBorderProps>) => {
  const props = {
    intl: intlMock,
    toggleBorder: jest.fn(),
    setBorder: jest.fn(),
    ...propsOverrides,
  };
  const editorRef = {
    current: document.createElement('div'),
  };
  const wrapper = render(
    <IntlProvider locale="en">
      <ReactEditorViewContext.Provider
        value={{
          editorRef: editorRef,
        }}
      >
        <ImageBorder {...props} />
      </ReactEditorViewContext.Provider>
    </IntlProvider>,
  );
  return {
    props,
    wrapper,
  };
};

describe('Image border toolbar item', () => {
  it('should show image border toolbar items', async () => {
    const { wrapper } = setup();

    expect(wrapper).toMatchSnapshot();
  });

  it('should toggle Border when border button is clicked', () => {
    const { props } = setup();
    const borderBtn = screen.getByLabelText(messages.addBorder.defaultMessage);
    fireEvent.click(borderBtn);
    expect(props.toggleBorder).toHaveBeenCalled();
  });

  it("should have its border button label as 'add border' when the border mark is not enabled", () => {
    setup();

    expect(
      screen.getByLabelText(messages.addBorder.defaultMessage),
    ).toBeInTheDocument();
  });

  it("should have its border button label as 'remove border' when the border mark is enabled", () => {
    setup({
      borderMark: {
        color: '#091e4224',
        size: 2,
      },
    });

    expect(
      screen.getByLabelText(messages.removeBorder.defaultMessage),
    ).toBeInTheDocument();
  });

  it('should show border options when dropdown button is clicked', async () => {
    setup();
    const dropdownBtn = screen.getByLabelText(
      messages.borderOptions.defaultMessage,
    );
    fireEvent.click(dropdownBtn);
    const colorOption = await screen.findByTestId('dropdown-item__Color');
    const sizeOption = await screen.findByTestId('dropdown-item__Size');
    expect(colorOption).toBeInTheDocument();
    expect(sizeOption).toBeInTheDocument();
  });

  it('should hide border options when dropdown button is clicked again', () => {
    setup();
    const dropdownBtn = screen.getByLabelText(
      messages.borderOptions.defaultMessage,
    );
    fireEvent.click(dropdownBtn);
    fireEvent.click(dropdownBtn);
    const colorOption = screen.queryByTestId('dropdown-item__Color');
    const sizeOption = screen.queryByTestId('dropdown-item__Size');
    expect(colorOption).not.toBeInTheDocument();
    expect(sizeOption).not.toBeInTheDocument();
  });

  it('should show color secondary menu when color option is clicked', async () => {
    setup();
    const dropdownBtn = screen.getByLabelText(
      messages.borderOptions.defaultMessage,
    );
    fireEvent.click(dropdownBtn);
    const colorOption = await screen.findByTestId('dropdown-item__Color');
    fireEvent.click(colorOption);
    const subtleGreyColor = await screen.findByLabelText('Subtle gray');
    const greyColor = await screen.findByLabelText('Gray');
    const boldGreyColor = await screen.findByLabelText('Bold gray');

    expect(subtleGreyColor).toBeInTheDocument();
    expect(greyColor).toBeInTheDocument();
    expect(boldGreyColor).toBeInTheDocument();
  });

  it('should hide color secondary menu when color option is clicked again', async () => {
    setup();
    const dropdownBtn = screen.getByLabelText(
      messages.borderOptions.defaultMessage,
    );
    fireEvent.click(dropdownBtn);
    const colorOption = await screen.findByTestId('dropdown-item__Color');
    fireEvent.click(colorOption);
    fireEvent.click(colorOption);
    const subtleGreyColor = screen.queryByLabelText('Subtle gray');
    const greyColor = screen.queryByLabelText('Gray');
    const boldGreyColor = screen.queryByLabelText('Bold gray');

    expect(subtleGreyColor).not.toBeInTheDocument();
    expect(greyColor).not.toBeInTheDocument();
    expect(boldGreyColor).not.toBeInTheDocument();
  });

  it('should set border color when color is chosen', async () => {
    const { props } = setup();
    const dropdownBtn = screen.getByLabelText(
      messages.borderOptions.defaultMessage,
    );
    fireEvent.click(dropdownBtn);
    const colorOption = await screen.findByTestId('dropdown-item__Color');
    fireEvent.click(colorOption);
    const subtleGreyColor = await screen.findByLabelText('Subtle gray');
    fireEvent.click(subtleGreyColor);
    expect(props.setBorder).toBeCalledWith({ color: '#091e4224' });
  });

  it('should show size secondary menu when size option is clicked', async () => {
    setup();
    const dropdownBtn = screen.getByLabelText(
      messages.borderOptions.defaultMessage,
    );
    fireEvent.click(dropdownBtn);
    const colorOption = await screen.findByTestId('dropdown-item__Size');
    fireEvent.click(colorOption);
    const subtleSize = await screen.findByLabelText('Subtle');
    const mediumSize = await screen.findByLabelText('Medium');
    const boldSize = await screen.findByLabelText('Bold');

    expect(subtleSize).toBeInTheDocument();
    expect(mediumSize).toBeInTheDocument();
    expect(boldSize).toBeInTheDocument();
  });

  it('should hide size secondary menu when size option is clicked again', async () => {
    setup();
    const dropdownBtn = screen.getByLabelText(
      messages.borderOptions.defaultMessage,
    );
    fireEvent.click(dropdownBtn);
    const colorOption = await screen.findByTestId('dropdown-item__Size');
    fireEvent.click(colorOption);
    fireEvent.click(colorOption);
    const subtleSize = screen.queryByLabelText('Subtle');
    const mediumSize = screen.queryByLabelText('Medium');
    const boldSize = screen.queryByLabelText('Bold');

    expect(subtleSize).not.toBeInTheDocument();
    expect(mediumSize).not.toBeInTheDocument();
    expect(boldSize).not.toBeInTheDocument();
  });

  it('should set border size when size is chosen', async () => {
    const { props } = setup();
    const dropdownBtn = screen.getByLabelText(
      messages.borderOptions.defaultMessage,
    );
    fireEvent.click(dropdownBtn);
    const colorOption = await screen.findByTestId('dropdown-item__Size');
    fireEvent.click(colorOption);
    const subtleSize = await screen.findByLabelText('Subtle');
    fireEvent.click(subtleSize);
    expect(props.setBorder).toBeCalledWith({ size: 1 });
  });
});
