import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { render, waitForElement } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TitleBlock from '../index';
import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { FlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import {
  ElementName,
  SmartLinkStatus,
  SmartLinkTheme,
} from '../../../../../../constants';
import { TitleBlockProps } from '../types';
import { messages } from '../../../../../../messages';
import {
  makeCustomActionItem,
  makeDeleteActionItem,
} from '../../../../../../../examples/flexible-ui/utils';

describe('TitleBlock', () => {
  const testId = 'smart-block-title-resolved-view';
  const titleTestId = 'smart-element-link';
  const iconTestId = 'smart-element-icon';

  const renderTitleBlock = (props?: TitleBlockProps) => {
    return render(
      <IntlProvider locale="en">
        <FlexibleUiContext.Provider value={context}>
          <TitleBlock status={SmartLinkStatus.Resolved} {...props} />
        </FlexibleUiContext.Provider>
      </IntlProvider>,
    );
  };

  it('renders block', async () => {
    const { getByTestId } = renderTitleBlock();

    const block = await waitForElement(() => getByTestId(testId));

    expect(block).toBeDefined();
    expect(block.getAttribute('data-smart-block')).toBeTruthy();
  });

  it('renders its default elements', async () => {
    const { getByTestId } = renderTitleBlock();

    const title = await waitForElement(() => getByTestId(titleTestId));
    const icon = await waitForElement(() => getByTestId(iconTestId));

    expect(title).toBeDefined();
    expect(icon).toBeDefined();
  });

  it('renders metadata', async () => {
    const { getByTestId } = renderTitleBlock({
      metadata: [
        { name: ElementName.CommentCount, testId: 'metadata-element' },
      ],
    });

    const element = await waitForElement(() => getByTestId('metadata-element'));

    expect(element).toBeDefined();
  });

  it('renders subtitle', async () => {
    const { getByTestId } = renderTitleBlock({
      subtitle: [
        { name: ElementName.CommentCount, testId: 'subtitle-element' },
      ],
    });

    const element = await waitForElement(() => getByTestId('subtitle-element'));

    expect(element).toBeDefined();
  });

  it('should render actions', async () => {
    const testId = 'smart-element-test';
    const { getByTestId, queryByTestId } = renderTitleBlock({
      actions: [
        makeDeleteActionItem({ testId: `${testId}-1` }),
        makeCustomActionItem({ testId: `${testId}-2` }),
      ],
    });

    for (let i = 0; i < 2; i++) {
      const element = await waitForElement(() =>
        getByTestId(`smart-element-test-${i + 1}`),
      );
      expect(element).toBeDefined();
    }

    expect(queryByTestId(`action-group-more-button`)).toBeNull();
  });

  it('should render only one action when on hover only activated', async () => {
    const testId = 'smart-element-test';
    const { getByTestId, queryByTestId } = renderTitleBlock({
      actions: [
        makeDeleteActionItem({ testId: `${testId}-1` }),
        makeCustomActionItem({ testId: `${testId}-2` }),
      ],
      showActionOnHover: true,
    });

    const moreButton = await waitForElement(() =>
      getByTestId('action-group-more-button'),
    );
    expect(moreButton).toBeDefined();

    expect(queryByTestId(`smart-element-test-1`)).toBeNull();
    expect(queryByTestId(`smart-element-test-2`)).toBeNull();

    userEvent.click(moreButton);

    for (let i = 0; i < 2; i++) {
      const element = await waitForElement(() =>
        getByTestId(`smart-element-test-${i + 1}`),
      );
      expect(element).toBeDefined();
    }
  });

  describe('Title', () => {
    it('renders title element with parent props including text override', async () => {
      const { getByTestId } = renderTitleBlock({
        theme: SmartLinkTheme.Black,
        maxLines: 2,
        text: 'Spaghetti',
      });

      const element = await waitForElement(() => getByTestId(titleTestId));
      expect(element.textContent).toEqual('Spaghetti');

      expect(element).toHaveStyleDeclaration(
        'color',
        expect.stringContaining('#44546F'),
      );
    });
  });

  describe('status', () => {
    it.each([
      [SmartLinkStatus.Resolved, 'smart-block-title-resolved-view'],
      [SmartLinkStatus.Resolving, 'smart-block-title-resolving-view'],
      [SmartLinkStatus.Forbidden, 'smart-block-title-errored-view'],
      [SmartLinkStatus.Errored, 'smart-block-title-errored-view'],
      [SmartLinkStatus.NotFound, 'smart-block-title-errored-view'],
      [SmartLinkStatus.Unauthorized, 'smart-block-title-errored-view'],
      [SmartLinkStatus.Fallback, 'smart-block-title-errored-view'],
    ])('renders %s view', async (status: SmartLinkStatus, expectedTestId) => {
      const { getByTestId } = renderTitleBlock({ status });

      const element = await waitForElement(() => getByTestId(expectedTestId));

      expect(element).toBeDefined();
    });

    it('renders formatted message', async () => {
      const { getByTestId } = renderTitleBlock({
        status: SmartLinkStatus.NotFound,
        retry: { descriptor: messages.cannot_find_link },
      });

      const message = await waitForElement(() =>
        getByTestId('smart-block-title-errored-view-message'),
      );

      expect(message.textContent).toEqual("Can't find link");
    });
  });
});
