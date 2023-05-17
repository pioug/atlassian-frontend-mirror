import React from 'react';

import { render } from '@testing-library/react';

import Status, { STATUS_TYPE_TEST_ID } from './index';

describe('Status Type', () => {
  const setup = ({ text = '', status = 'default', ...props }) => {
    return render(<Status text={text} status={status as any} {...props} />);
  };

  it('renders with the text passed', async () => {
    const { queryByTestId } = setup({
      text: 'DONE',
    });

    const el = queryByTestId(STATUS_TYPE_TEST_ID);

    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('DONE');
  });

  it('does not render when the text is empty', async () => {
    const { queryByTestId } = setup({
      text: '',
    });
    expect(queryByTestId(STATUS_TYPE_TEST_ID)).not.toBeInTheDocument();
  });

  it('renders with the styles passed', async () => {
    const { queryByTestId } = setup({
      text: 'DONE',
      style: {
        color: 'color',
        backgroundColor: 'green',
      },
    });

    const status = queryByTestId(STATUS_TYPE_TEST_ID);
    const statusText = queryByTestId(`${STATUS_TYPE_TEST_ID}--text`);

    expect(status).toBeInTheDocument();
    expect(statusText).toBeInTheDocument();

    expect(status).toHaveStyle({
      background: 'green',
    });
    expect(statusText).toHaveStyle({
      color: 'color',
    });
  });
});
