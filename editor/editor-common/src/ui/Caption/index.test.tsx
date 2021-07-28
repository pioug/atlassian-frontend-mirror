import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { N200, N400 } from '@atlaskit/theme/colors';

import { messages } from './messages';

import Caption from './index';

const renderWithIntl = (component: React.ReactNode) => {
  return render(<IntlProvider locale="en">{component}</IntlProvider>);
};

describe('CaptionComponent', () => {
  it('should show a placeholder by default', () => {
    const { getByText } = renderWithIntl(<Caption />);

    expect(getByText(messages.placeholder.defaultMessage)).not.toBeNull();
  });

  it('should have the placeholder colour as N200', () => {
    const { getByText } = renderWithIntl(<Caption />);

    expect(getByText(messages.placeholder.defaultMessage)).toHaveStyle(
      `color: ${N200}`,
    );
  });

  it('should have the colour N400', () => {
    const { container } = renderWithIntl(<Caption />);

    expect(container.firstChild).toHaveStyle(`color: ${N400}`);
  });

  it('should have centered text', () => {
    const { container } = renderWithIntl(<Caption />);

    expect(container.firstChild).toHaveStyle(`text-align: center`);
  });

  it("shouldn't show the placeholder when selected", () => {
    const { queryByText } = renderWithIntl(<Caption selected={true} />);

    expect(queryByText(messages.placeholder.defaultMessage)).toBeNull();
  });

  it("shouldn't show the placeholder if caption has content", () => {
    const { queryByText } = renderWithIntl(<Caption hasContent={true} />);
    expect(queryByText(messages.placeholder.defaultMessage)).toBeNull();
  });

  it('should have data-renderer-start-pos if provided', () => {
    const { getByTestId } = renderWithIntl(
      <Caption dataAttributes={{ 'data-renderer-start-pos': 5 }} />,
    );

    const caption = getByTestId('media-caption');

    expect(caption.getAttribute('data-renderer-start-pos')).toEqual('5');
  });

  it('should have data-media-caption', () => {
    const { getByTestId } = renderWithIntl(<Caption />);

    const caption = getByTestId('media-caption');

    expect(caption.getAttribute('data-media-caption')).toEqual('true');
  });
});
