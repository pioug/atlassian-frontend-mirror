import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { IntlShape, IntlProvider } from 'react-intl-next';

import ImageBorder, { ImageBorderProps } from '../../index';
import { messages } from '../../messages';

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
  const wrapper = render(
    <IntlProvider locale="en">
      <ImageBorder {...props} />
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

  it('should border button label is add border when border mark not enabled', () => {
    setup();

    expect(
      screen.getByLabelText(messages.addBorder.defaultMessage),
    ).toBeInTheDocument();
  });

  it('should border button label is remove border when border mark is enabled', () => {
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
