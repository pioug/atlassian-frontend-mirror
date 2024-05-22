import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { render, screen } from '@testing-library/react';
import RelatedLinksModal from "../components/RelatedLinksBaseModal";

const renderRelatedLinksModal = () => {
  return render(
    <IntlProvider locale={'en'}>
      <RelatedLinksModal onClose={() => {}} showModal={true} children={undefined}/>
    </IntlProvider>,
  );
};

describe('RelatedLinksModel', () => {
  it('renders related links model', async () => {
    renderRelatedLinksModal();
    // a modal component has role dialog
    const modal = await screen.findByRole('dialog');
    const modalTitle = await screen.findByText('Recent Links');
    const closeButton = await screen.findByRole('button', {name: 'Close'});
    expect(modal).toBeInTheDocument();
    expect(modalTitle).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });
});
