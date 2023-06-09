import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { css } from '@emotion/react';
import { render } from '@testing-library/react';

import Text from '../index';
import { messages } from '../../../../../../messages';

describe('Element: Text', () => {
  const testId = 'smart-element-text';

  it('renders element', async () => {
    const content = 'random text';
    const { findByTestId } = render(<Text content={content} />);

    const element = await findByTestId(testId);

    expect(element).toBeTruthy();
    expect(element.getAttribute('data-smart-element-text')).toBeTruthy();
    expect(element.textContent).toBe(content);
  });

  it('renders formatted message', async () => {
    const message = {
      descriptor: messages.cannot_find_link,
    };
    const { findByTestId } = render(
      <IntlProvider locale="en">
        <Text message={message} />
      </IntlProvider>,
    );

    const element = await findByTestId(testId);

    expect(element.textContent).toBe(messages.cannot_find_link.defaultMessage);
  });

  it('renders formatted message as priority', async () => {
    const message = {
      descriptor: messages.cannot_find_link,
    };
    const { findByTestId } = render(
      <IntlProvider locale="en">
        <Text content="random text" message={message} />
      </IntlProvider>,
    );

    const element = await findByTestId(testId);

    expect(element.textContent).toBe(messages.cannot_find_link.defaultMessage);
  });

  it('renders formatted messages with values', async () => {
    const message = {
      descriptor: messages.created_by,
      values: { context: 'someone' },
    };
    const { findByTestId } = render(
      <IntlProvider locale="en">
        <Text content="random text" message={message} />
      </IntlProvider>,
    );

    const element = await findByTestId(testId);

    expect(element.textContent).toBe('Created by someone');
  });

  it('does not renders without either message or children', async () => {
    const { container } = render(<Text />);

    expect(container.children.length).toBe(0);
  });

  it('renders with override css', async () => {
    const overrideCss = css`
      color: black;
    `;
    const { findByTestId } = render(
      <Text content="random text" overrideCss={overrideCss} />,
    );

    const element = await findByTestId(testId);

    expect(element).toHaveStyleDeclaration('color', 'black');
  });
});
