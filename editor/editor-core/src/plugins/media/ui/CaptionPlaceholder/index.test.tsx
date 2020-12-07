import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { N200 } from '@atlaskit/theme/colors';

import { messages } from './messages';

import CaptionPlaceholder from './index';

const renderWithIntl = (component: React.ReactNode) => {
  return render(<IntlProvider locale="en">{component}</IntlProvider>);
};

const onClick = () => {};

describe('CaptionComponent', () => {
  it('should show a placeholder by default', () => {
    const { getByText } = renderWithIntl(
      <CaptionPlaceholder onClick={onClick} />,
    );

    expect(getByText(messages.placeholder.defaultMessage)).not.toBeNull();
  });

  it('should have the placeholder colour as N200', () => {
    const { container } = renderWithIntl(
      <CaptionPlaceholder onClick={onClick} />,
    );

    expect(container.firstChild).toHaveStyle(`color: ${N200}`);
  });

  it('placeholder should be centered', () => {
    const { container } = renderWithIntl(
      <CaptionPlaceholder onClick={onClick} />,
    );

    expect(container.firstChild).toHaveStyle(`text-align: center`);
  });
});
