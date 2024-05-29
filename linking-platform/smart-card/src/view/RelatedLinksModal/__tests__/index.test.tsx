import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { render, screen } from '@testing-library/react';
import RelatedLinksBaseModal from "../components/RelatedLinksBaseModal";
import RelatedLinksResolvedView from "../views/resolved";
import {type CardClient} from "@atlaskit/link-provider";
import {fakeFactory, mocks} from "../../../utils/mocks";
import {Provider} from "@atlaskit/smart-card";

const renderRelatedLinksModal = () => {
  return render(
    <IntlProvider locale={'en'}>
      <RelatedLinksBaseModal onClose={() => {}} showModal={true} children={undefined}/>
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

  describe('ResolvedView', () => {
    const mockUrl = 'https://some.url';
    let mockClient: CardClient;
    let mockFetch: jest.Mock;

    beforeEach(() => {
      mockFetch = jest.fn(() => Promise.resolve(mocks.success));
      mockClient = new (fakeFactory(mockFetch))();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    const renderRelatedLinksResolvedView = (incomingLinks: string[], outgoingLinks: string[]) => {
      return render(
        <IntlProvider locale={'en'}>
          <Provider client={mockClient}>
            <RelatedLinksBaseModal onClose={() => {}} showModal={true}>
              <RelatedLinksResolvedView
                incomingLinks={incomingLinks}
                outgoingLinks={outgoingLinks}
              />
            </RelatedLinksBaseModal>
          </Provider>
        </IntlProvider>,
      );
    };

    it('renders related links modal with resolved view', async () => {
      renderRelatedLinksResolvedView([mockUrl, mockUrl], [mockUrl]);

      const modal = await screen.findByRole('dialog');
      expect(modal).toBeInTheDocument();

      const incomingLinksHeading = await screen.findByText('Found In');
      expect(incomingLinksHeading).toBeInTheDocument();

      const outgoingLinksHeading = await screen.findByText('Includes Links To')
      expect(outgoingLinksHeading).toBeInTheDocument();

      const allLinks = await screen.findAllByRole('link');
      expect(allLinks.length).toBe(3);

      const incomingLinks = await screen.findByTestId('incoming-related-links-list');
      expect(incomingLinks).toBeInTheDocument();
      expect(await screen.findByTestId('incoming-related-links-list-item-0')).toBeInTheDocument();
      expect(await screen.findByTestId('incoming-related-links-list-item-1')).toBeInTheDocument();

      const outgoingLinks = await screen.findByTestId('outgoing-related-links-list');
      expect(outgoingLinks).toBeInTheDocument();
      expect(await screen.findByTestId('outgoing-related-links-list-item-0')).toBeInTheDocument();
    });



    it('renders related links modal resolved view with empty links', async () => {
      renderRelatedLinksResolvedView([], []);

      const modal = await screen.findByRole('dialog');
      expect(modal).toBeInTheDocument();

      const incomingLinksHeading = await screen.findByText('Found In');
      expect(incomingLinksHeading).toBeInTheDocument();

      const outgoingLinksHeading = await screen.findByText('Includes Links To')
      expect(outgoingLinksHeading).toBeInTheDocument();

      const allLinks = screen.queryAllByRole('links');
      expect(allLinks.length).toBe(0);

      const incomingLinks = await screen.findByTestId('incoming-related-links-list');
      expect(incomingLinks).toBeInTheDocument();

      const outgoingLinks = await screen.findByTestId('outgoing-related-links-list');
      expect(outgoingLinks).toBeInTheDocument();

      const emptyListText = await screen.findAllByText('We didn\'t find any links to show here.');
      expect(emptyListText.length).toBe(2);
    });

  })
});
