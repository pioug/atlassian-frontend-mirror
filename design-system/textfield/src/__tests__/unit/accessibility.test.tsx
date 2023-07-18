import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import Textfield from '../../index';

describe('Text field basic accessibility unit tests with jest-axe', () => {
  const defaultProps = {
    testId: 'basic-textfield',
    id: 'basic-textfield',
  };

  it('Text field with label should not fail an aXe audit', async () => {
    const { container } = render(
      <div>
        <label htmlFor={defaultProps.id}>Default text field</label>
        <Textfield {...defaultProps} />
      </div>,
    );
    await axe(container);
  });

  it('Text field with aria-label should not fail an aXe audit', async () => {
    const { container } = render(
      <Textfield {...defaultProps} aria-label="default text field" />,
    );
    await axe(container);
  });

  it('Required Text field should not fail an aXe audit', async () => {
    const { container } = render(
      <div>
        <label htmlFor={defaultProps.id}>Default text field</label>
        <Textfield {...defaultProps} isRequired />
      </div>,
    );
    await axe(container);
  });

  it('Required text field with aria-label should not fail an aXe audit', async () => {
    const { container } = render(
      <Textfield
        {...defaultProps}
        isRequired
        aria-label="default text field"
      />,
    );
    await axe(container);
  });

  it('Disabled Text field should not fail an aXe audit', async () => {
    const { container } = render(
      <div>
        <label htmlFor={defaultProps.id}>Default text field</label>
        <Textfield {...defaultProps} isDisabled />
      </div>,
    );
    await axe(container);
  });

  it('Disabled text field with aria-label should not fail an aXe audit', async () => {
    const { container } = render(
      <Textfield
        {...defaultProps}
        isDisabled
        aria-label="default text field"
      />,
    );
    await axe(container);
  });

  it('Invalid Text field should not fail an aXe audit', async () => {
    const { container } = render(
      <div>
        <label htmlFor={defaultProps.id}>Default text field</label>
        <Textfield {...defaultProps} isInvalid />
      </div>,
    );
    await axe(container);
  });

  it('Invalid text field with aria-label should not fail an aXe audit', async () => {
    const { container } = render(
      <Textfield {...defaultProps} isInvalid aria-label="default text field" />,
    );
    await axe(container);
  });

  it('Read only Text field should not fail an aXe audit', async () => {
    const { container } = render(
      <div>
        <label htmlFor={defaultProps.id}>Default text field</label>
        <Textfield {...defaultProps} isReadOnly />
      </div>,
    );
    await axe(container);
  });

  it('Read only text field with aria-label should not fail an aXe audit', async () => {
    const { container } = render(
      <Textfield
        {...defaultProps}
        isReadOnly
        aria-label="default text field"
      />,
    );
    await axe(container);
  });
});
