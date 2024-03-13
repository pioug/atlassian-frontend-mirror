import React, { PropsWithChildren } from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import Panel from '../../Panel';

const NestedContent = () => (
  <p>
    Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco
    deserunt aute id consequat veniam incididunt duis in sint irure nisi. Mollit
    officia cillum Lorem ullamco minim nostrud elit officia tempor esse quis.
  </p>
);

type TestWrapperProps = PropsWithChildren<{
  locale?: string;
}>;

const TestWrapper = ({ children, locale = 'en' }: TestWrapperProps) => (
  <IntlProvider locale={locale}>{children}</IntlProvider>
);

const Header = <span>Header</span>;

describe('Panel component', () => {
  it('toggles height prop of AnimateHeight component when clicked on header', async () => {
    const { container, getByText } = render(
      <TestWrapper>
        <Panel header={Header}>
          <NestedContent />
        </Panel>
      </TestWrapper>,
    );

    let panelContent = container.getElementsByClassName('panel-content');
    expect(panelContent[0]).toHaveStyle({ height: '0px' });

    userEvent.click(getByText('Header'));
    await waitFor(() =>
      expect(panelContent[0]).toHaveStyle({ height: 'auto' }),
    );
  });
  it('is expanded by default when isDefaultExpanded is passed', () => {
    const { container } = render(
      <TestWrapper>
        <Panel header={Header} isDefaultExpanded>
          <NestedContent />
        </Panel>
      </TestWrapper>,
    );

    const panelContent = container.getElementsByClassName('panel-content');
    expect(panelContent[0]).toHaveStyle({ height: 'auto' });
  });
});
