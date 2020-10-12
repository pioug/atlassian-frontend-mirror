import React from 'react';
import {
  mockEndpoints,
  REQUEST_FAST,
} from '@atlaskit/atlassian-switcher-test-utils';
import { initSwitcher } from './vanilla-page/scripts';

// @ts-ignore
import styles from './vanilla-page/styles.css';

/**
 * This file uses react because it's what the atlaskit examples api expects. It tries to ressemble
 * closely what a non react app would use. Consider the content of the `HTMLPage` function as the content
 * of your `html` file. The code inside `./vanilla-page/scripts` is your vanilla js example.
 */

const HTMLPage = () => (
  <>
    <div id="nav" className={styles.nav}>
      <p id="switcher-message" className={styles.switcherMessage}>
        Hover the switcher icon to preload the switcher.{' '}
        <button id="switcher-trigger" className={styles.switcherTrigger}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            focusable="false"
            role="presentation"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M4 5.01C4 4.451 4.443 4 5.01 4h1.98C7.549 4 8 4.443 8 5.01v1.98C8 7.549 7.557 8 6.99 8H5.01C4.451 8 4 7.557 4 6.99V5.01zm0 6c0-.558.443-1.01 1.01-1.01h1.98c.558 0 1.01.443 1.01 1.01v1.98C8 13.549 7.557 14 6.99 14H5.01C4.451 14 4 13.557 4 12.99v-1.98zm6-6c0-.558.443-1.01 1.01-1.01h1.98c.558 0 1.01.443 1.01 1.01v1.98C14 7.549 13.557 8 12.99 8h-1.98C10.451 8 10 7.557 10 6.99V5.01zm0 6c0-.558.443-1.01 1.01-1.01h1.98c.558 0 1.01.443 1.01 1.01v1.98c0 .558-.443 1.01-1.01 1.01h-1.98c-.558 0-1.01-.443-1.01-1.01v-1.98zm6-6c0-.558.443-1.01 1.01-1.01h1.98c.558 0 1.01.443 1.01 1.01v1.98C20 7.549 19.557 8 18.99 8h-1.98C16.451 8 16 7.557 16 6.99V5.01zm0 6c0-.558.443-1.01 1.01-1.01h1.98c.558 0 1.01.443 1.01 1.01v1.98c0 .558-.443 1.01-1.01 1.01h-1.98c-.558 0-1.01-.443-1.01-1.01v-1.98zm-12 6c0-.558.443-1.01 1.01-1.01h1.98c.558 0 1.01.443 1.01 1.01v1.98C8 19.549 7.557 20 6.99 20H5.01C4.451 20 4 19.557 4 18.99v-1.98zm6 0c0-.558.443-1.01 1.01-1.01h1.98c.558 0 1.01.443 1.01 1.01v1.98c0 .558-.443 1.01-1.01 1.01h-1.98c-.558 0-1.01-.443-1.01-1.01v-1.98zm6 0c0-.558.443-1.01 1.01-1.01h1.98c.558 0 1.01.443 1.01 1.01v1.98c0 .558-.443 1.01-1.01 1.01h-1.98c-.558 0-1.01-.443-1.01-1.01v-1.98z"
            />
          </svg>
        </button>
      </p>
      <div id="switcher-container" className={styles.switcherContainer} />
    </div>

    <button id="switcher-destroy" className={styles.switcherDestroy}>
      Destroy switcher
    </button>
  </>
);

export default class NativeWrapperExample extends React.Component {
  componentWillMount() {
    mockEndpoints('jira', originalMockData => originalMockData, REQUEST_FAST);
  }

  componentDidMount() {
    initSwitcher();
  }

  render() {
    return <HTMLPage />;
  }
}
