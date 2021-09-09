/** @jsx jsx */
import { useEffect, useState } from 'react';

import { jsx } from '@emotion/core';

import Popup from '@atlaskit/popup';
import Spinner from '@atlaskit/spinner';
import AtlassianSwitcher from '@atlassian/switcher';
import { mockEndpoints, REQUEST_FAST } from '@atlassian/switcher-test-utils';

import { AppSwitcher } from '../../src';
import { withAnalyticsLogger, withIntlProvider } from '../helpers';

const spinnerCSS = {
  display: 'flex',
  justifyContent: 'center',
  maxWidth: 240,
  position: 'relative',
  top: '11.25rem',
} as const;

const SwitcherData: React.FC<{ update: () => void }> = ({ update }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    mockEndpoints(
      'jira',
      (originalMockData) => {
        return {
          ...originalMockData,
          RECENT_CONTAINERS_DATA: {
            data: [],
          },
          CUSTOM_LINKS_DATA: {
            data: [],
          },
          XFLOW_SETTINGS: {},
        };
      },
      REQUEST_FAST,
    );

    setIsLoaded(true);
    update();
  }, [update]);

  return isLoaded ? (
    <div style={{ width: 400, maxHeight: 'calc(100vh - 100px)' }}>
      <h3 style={{ padding: '24px 24px 8px 24px' }}>Switch to</h3>
      <div style={{ padding: '0 16px' }}>
        <AtlassianSwitcher
          product="jira"
          disableCustomLinks
          cloudId="some-cloud-id"
          appearance="standalone"
        />
      </div>
    </div>
  ) : (
    <div css={spinnerCSS}>
      <Spinner size="large" />
    </div>
  );
};

const SwitcherContent = withIntlProvider(withAnalyticsLogger(SwitcherData));

export const SwitcherPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Popup
      placement="bottom-start"
      content={({ update }) => <SwitcherContent update={update} />}
      isOpen={isOpen}
      onClose={onClose}
      trigger={(triggerProps) => (
        <AppSwitcher
          onClick={onClick}
          tooltip="Switch to..."
          {...triggerProps}
        />
      )}
    />
  );
};
