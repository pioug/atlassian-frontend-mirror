import React from 'react';

import { render } from '@testing-library/react';

import { SimpleTag } from '../../index';

describe('<SimpleTag />', () => {
  it('should render simple Tag with supplied text without any removable functionality', () => {
    const text = 'Atlassian Design System';
    const { getByText, container } = render(
      <SimpleTag text={text} href="https://atlassian.design" />,
    );
    expect(getByText(text)).toBeInTheDocument();
    expect(container.querySelector('button')).not.toBeInTheDocument();
  });
});
