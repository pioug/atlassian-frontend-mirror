/** @jsx jsx */
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import { jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import { IntlMessagesProvider } from '@atlaskit/intl-messages-provider';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@atlaskit/modal-dialog';

import { Site } from '../../../common/types';
import { fetchMessagesForLocale } from '../../../common/utils/locale/fetch-messages-for-locale';
import i18nEN from '../../../i18n/en';
import { getAvailableSites } from '../../../services/getAvailableSites';
import { NoInstancesView } from '../../common/error-state/no-instances';
import { InitialStateView } from '../../common/initial-state-view';
import { BasicSearchInput } from '../../common/modal/basic-search-input';
import { ContentContainer } from '../../common/modal/content-container';
import { SiteSelector } from '../../common/modal/site-selector';
import { ConfluenceSearchConfigModalProps } from '../types';

import { ConfluenceSearchInitialStateSVG } from './confluence-search-initial-state-svg';
import { confluenceSearchModalMessages } from './messages';

export const ConfluenceSearchConfigModal = (
  props: ConfluenceSearchConfigModalProps,
) => {
  const { parameters: initialParameters, onCancel } = props;
  const [availableSites, setAvailableSites] = useState<Site[] | undefined>(
    undefined,
  );
  const [cloudId, setCloudId] = useState(initialParameters?.cloudId);
  const [searchTerm, setSearchTerm] = useState('');

  const onSiteSelection = useCallback(
    (site: Site) => {
      setCloudId(site.cloudId);
    },
    [setCloudId],
  );

  const hasNoConfluenceSites = availableSites && availableSites.length === 0;

  const selectedConfluenceSite = useMemo<Site | undefined>(() => {
    if (cloudId) {
      return availableSites?.find(
        confluenceSite => confluenceSite.cloudId === cloudId,
      );
    } else {
      let currentlyLoggedInSiteUrl: string | undefined;
      if (typeof window.location !== 'undefined') {
        currentlyLoggedInSiteUrl = window.location.origin;
      }
      return (
        availableSites?.find(
          confluenceSite => confluenceSite.url === currentlyLoggedInSiteUrl,
        ) || availableSites?.[0]
      );
    }
  }, [availableSites, cloudId]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawSearch = e.currentTarget.value;
      setSearchTerm(rawSearch);
    },
    [setSearchTerm],
  );

  useEffect(() => {
    const fetchSiteDisplayNames = async () => {
      const confluenceSites = await getAvailableSites('confluence');
      const sortedAvailableSites = [...confluenceSites].sort((a, b) =>
        a.displayName.localeCompare(b.displayName),
      );
      setAvailableSites(sortedAvailableSites);
    };

    void fetchSiteDisplayNames();
  }, []);

  const siteSelectorLabel =
    availableSites && availableSites.length > 1
      ? confluenceSearchModalMessages.insertIssuesTitleManySites
      : confluenceSearchModalMessages.insertIssuesTitle;

  return (
    <IntlMessagesProvider
      defaultMessages={i18nEN}
      loaderFn={fetchMessagesForLocale}
    >
      <Modal
        testId="confluence-search-datasource-modal"
        onClose={onCancel}
        width="calc(100% - 80px)"
        shouldScrollInViewport={true}
      >
        <ModalHeader>
          <ModalTitle>
            <SiteSelector
              availableSites={availableSites}
              onSiteSelection={onSiteSelection}
              selectedSite={selectedConfluenceSite}
              testId="confluence-search-datasource-modal--site-selector"
              label={siteSelectorLabel}
            />
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          {!hasNoConfluenceSites ? (
            <Fragment>
              <BasicSearchInput
                testId="confluence-search-datasource-modal"
                isSearching={status === 'loading'}
                onChange={handleSearchChange}
                onSearch={() => {}}
                searchTerm={searchTerm}
                placeholder={confluenceSearchModalMessages.searchLabel}
                fullWidth
              />
              <ContentContainer>
                <InitialStateView
                  icon={<ConfluenceSearchInitialStateSVG />}
                  title={confluenceSearchModalMessages.initialViewSearchTitle}
                  description={
                    confluenceSearchModalMessages.initialViewSearchDescription
                  }
                />
              </ContentContainer>
            </Fragment>
          ) : (
            <NoInstancesView
              title={
                confluenceSearchModalMessages.noAccessToConfluenceSitesTitle
              }
              description={
                confluenceSearchModalMessages.noAccessToConfluenceSitesDescription
              }
              testId={'no-confluence-instances-content'}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button appearance="default" onClick={onCancel}>
            <FormattedMessage
              {...confluenceSearchModalMessages.cancelButtonText}
            />
          </Button>
          {!hasNoConfluenceSites && (
            <Button
              appearance="primary"
              onClick={() => {}}
              isDisabled={true}
              testId="confluence-search-datasource-modal--insert-button"
            >
              <FormattedMessage
                {...confluenceSearchModalMessages.insertResultsButtonText}
              />
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </IntlMessagesProvider>
  );
};
