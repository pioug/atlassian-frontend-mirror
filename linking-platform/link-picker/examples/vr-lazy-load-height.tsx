/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { MockLinkPickerPromisePlugin } from '@atlaskit/link-test-helpers/link-picker';

import { PageWrapper } from '../example-helpers/common';
import { LinkPicker } from '../src';
import { LoaderFallback } from '../src/ui/loader-fallback';
import { fixedWidthContainerStyles } from '../src/ui/styled';

const defaultPlugins = [
  new MockLinkPickerPromisePlugin({
    tabKey: 'tab1',
    tabTitle: 'Confluence',
  }),
  new MockLinkPickerPromisePlugin({
    tabKey: 'tab2',
    tabTitle: 'Bitbucket',
  }),
  new MockLinkPickerPromisePlugin({
    tabKey: 'tab3',
    tabTitle: 'Jira',
  }),
  new MockLinkPickerPromisePlugin({
    tabKey: 'tab4',
    tabTitle: 'Github',
  }),
  new MockLinkPickerPromisePlugin({
    tabKey: 'tab5',
    tabTitle: 'Drive',
  }),
  new MockLinkPickerPromisePlugin({
    tabKey: 'tab6',
    tabTitle: 'Tab long name 3',
  }),
  new MockLinkPickerPromisePlugin({
    tabKey: 'tab7',
    tabTitle: 'Tab long name 4',
  }),
  new MockLinkPickerPromisePlugin({
    tabKey: 'tab8',
    tabTitle: 'Tab long name 5',
  }),
  new MockLinkPickerPromisePlugin({
    tabKey: 'tab9',
    tabTitle: 'Tab long name 6',
  }),
  new MockLinkPickerPromisePlugin({
    tabKey: 'tab10',
    tabTitle: 'Tab long name 7',
  }),
  new MockLinkPickerPromisePlugin({
    tabKey: 'tab3',
    tabTitle: 'tab3',
  }),
];

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
const borderStyle = css`
  &[data-testid='link-picker-debug-border'] {
    /** Display the components left to right */
    display: inline-flex;

    /** Horizontally align the components by the top. Without this the children components
     * (Link Picker of Fallback) expand vertically and measurement is impossible. */
    align-items: flex-start;
  }

  /** Direct child divs - we don't want borders on every div in the link picker. */

  & > div {
    border: 1px solid red;
    /** Put some space between the items */
    margin-right: 5px;
  }
`;

export const BorderWrapper = ({ children }: { children: ReactNode }) => (
  <div css={borderStyle} data-testid="link-picker-debug-border">
    {children}
  </div>
);

export default function LazyLoadHeightExample() {
  return (
    <PageWrapper>
      <div data-testid="link-picker-lazy-load-height">
        <h1>Without display text</h1>
        <p>LinkPicker on left, LoaderFallback on right.</p>
        <BorderWrapper>
          <LinkPicker
            onSubmit={() => {}}
            onCancel={() => {}}
            hideDisplayText={true}
          />
          <div css={fixedWidthContainerStyles}>
            <LoaderFallback hideDisplayText={true}></LoaderFallback>
          </div>
        </BorderWrapper>

        <h1>With display text</h1>
        <p>LinkPicker on left, LoaderFallback on right.</p>
        <BorderWrapper>
          <LinkPicker
            onSubmit={() => {}}
            onCancel={() => {}}
            hideDisplayText={false}
          />
          <div css={fixedWidthContainerStyles}>
            <LoaderFallback hideDisplayText={false}></LoaderFallback>
          </div>
        </BorderWrapper>

        <h1>Without display text, with plugins</h1>
        <p>LinkPicker on left, LoaderFallback on right.</p>
        <BorderWrapper>
          <LinkPicker
            plugins={defaultPlugins}
            onSubmit={() => {}}
            onCancel={() => {}}
            hideDisplayText={true}
            featureFlags={{ scrollingTabs: true }}
          />
          <div css={fixedWidthContainerStyles}>
            <LoaderFallback
              hideDisplayText={true}
              isLoadingPlugins={true}
              plugins={[0]}
            ></LoaderFallback>
          </div>
        </BorderWrapper>

        <h1>With display text, with plugins</h1>
        <p>LinkPicker on left, LoaderFallback on right.</p>
        <BorderWrapper>
          <LinkPicker
            plugins={defaultPlugins}
            onSubmit={() => {}}
            onCancel={() => {}}
            featureFlags={{ scrollingTabs: true }}
          />
          <div css={fixedWidthContainerStyles}>
            <LoaderFallback
              isLoadingPlugins={true}
              plugins={[0]}
            ></LoaderFallback>
          </div>
        </BorderWrapper>
      </div>
    </PageWrapper>
  );
}
