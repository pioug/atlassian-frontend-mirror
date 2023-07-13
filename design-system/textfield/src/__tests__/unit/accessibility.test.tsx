import React from 'react';

import { render } from '@testing-library/react';

import {
  axe,
  jestAxeConfig,
  toHaveNoViolations,
} from '@af/accessibility-testing';

import Textfield from '../../index';

expect.extend(toHaveNoViolations);

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
    const results = await axe(container, jestAxeConfig);
    expect(results).toHaveNoViolations();
  });

  it('Text field with aria-label should not fail an aXe audit', async () => {
    const { container } = render(
      <Textfield {...defaultProps} aria-label="default text field" />,
    );
    const results = await axe(container, jestAxeConfig);
    expect(results).toHaveNoViolations();
  });

  it('Required Text field should not fail an aXe audit', async () => {
    const { container } = render(
      <div>
        <label htmlFor={defaultProps.id}>Default text field</label>
        <Textfield {...defaultProps} isRequired />
      </div>,
    );
    const results = await axe(container, jestAxeConfig);

    expect(results).toHaveNoViolations();
  });

  it('Required text field with aria-label should not fail an aXe audit', async () => {
    const { container } = render(
      <Textfield
        {...defaultProps}
        isRequired
        aria-label="default text field"
      />,
    );
    const results = await axe(container, jestAxeConfig);
    expect(results).toHaveNoViolations();
  });

  it('Disabled Text field should not fail an aXe audit', async () => {
    const { container } = render(
      <div>
        <label htmlFor={defaultProps.id}>Default text field</label>
        <Textfield {...defaultProps} isDisabled />
      </div>,
    );
    const results = await axe(container, jestAxeConfig);

    expect(results).toHaveNoViolations();
  });

  it('Disabled text field with aria-label should not fail an aXe audit', async () => {
    const { container } = render(
      <Textfield
        {...defaultProps}
        isDisabled
        aria-label="default text field"
      />,
    );
    const results = await axe(container, jestAxeConfig);
    expect(results).toHaveNoViolations();
  });

  it('Invalid Text field should not fail an aXe audit', async () => {
    const { container } = render(
      <div>
        <label htmlFor={defaultProps.id}>Default text field</label>
        <Textfield {...defaultProps} isInvalid />
      </div>,
    );
    const results = await axe(container, jestAxeConfig);

    expect(results).toHaveNoViolations();
  });

  it('Invalid text field with aria-label should not fail an aXe audit', async () => {
    const { container } = render(
      <Textfield {...defaultProps} isInvalid aria-label="default text field" />,
    );
    const results = await axe(container, jestAxeConfig);
    expect(results).toHaveNoViolations();
  });

  it('Read only Text field should not fail an aXe audit', async () => {
    const { container } = render(
      <div>
        <label htmlFor={defaultProps.id}>Default text field</label>
        <Textfield {...defaultProps} isReadOnly />
      </div>,
    );
    const results = await axe(container, jestAxeConfig);

    expect(results).toHaveNoViolations();
  });

  it('Read only text field with aria-label should not fail an aXe audit', async () => {
    const { container } = render(
      <Textfield
        {...defaultProps}
        isReadOnly
        aria-label="default text field"
      />,
    );
    const results = await axe(container, jestAxeConfig);
    expect(results).toHaveNoViolations();
  });
});
