/** @jsx jsx */
import { jsx } from '@emotion/react';
import { css } from '@emotion/react';
import { LinkPicker } from '../src';
import { PageWrapper } from '../example-helpers/common';
import { ReactNode } from 'react';
import { LoaderFallback } from '../src/ui/loader-fallback';

//  eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
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
          <LoaderFallback hideDisplayText={true}></LoaderFallback>
        </BorderWrapper>

        <h1>With display text</h1>
        <p>LinkPicker on left, LoaderFallback on right.</p>
        <BorderWrapper>
          <LinkPicker
            onSubmit={() => {}}
            onCancel={() => {}}
            hideDisplayText={false}
          />
          <LoaderFallback hideDisplayText={false}></LoaderFallback>
        </BorderWrapper>
      </div>
    </PageWrapper>
  );
}
