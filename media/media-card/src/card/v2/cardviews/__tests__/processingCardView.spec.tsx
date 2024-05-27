import React from 'react';
import { type FileDetails } from '@atlaskit/media-client';
import { spinnerTestId } from '../../../../__tests__/utils/_testIDs';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import { ProcessingCardView } from '../processingCardView';

const metadata: FileDetails = {
  id: 'abcd',
  name: 'my-file',
  mimeType: 'image/png',
  size: 42,
  mediaType: 'image',
};

describe('ProcessingCardView', () => {
  it('should render CreatingPreview', () => {
    render(
      <IntlProvider locale="en">
        <ProcessingCardView metadata={metadata} />
      </IntlProvider>,
    );
    expect(screen.queryByText('Creating preview...')).toBeInTheDocument();
  });
  it('should not render CreatingPreview when file size is zero', () => {
    render(
      <IntlProvider locale="en">
        <ProcessingCardView metadata={{ ...metadata, size: 0 }} />
      </IntlProvider>,
    );
    expect(screen.queryByText('Creating preview...')).not.toBeInTheDocument();
  });
  it('should not render Spinner', () => {
    render(
      <IntlProvider locale="en">
        <ProcessingCardView metadata={metadata} />
      </IntlProvider>,
    );
    expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();
  });
});

// TODO: write test cases for the other views
