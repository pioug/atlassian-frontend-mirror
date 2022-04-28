import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { css } from '@emotion/core';
import TitleBlock from '../index';
import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { FlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import {
  ActionName,
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
    const { findByTestId } = renderTitleBlock();

    const block = await findByTestId(testId);

    expect(block).toBeDefined();
    expect(block.getAttribute('data-smart-block')).toBeTruthy();
  });

  it('renders its default elements', async () => {
    const { findByTestId } = renderTitleBlock();

    const title = await findByTestId(titleTestId);
    const icon = await findByTestId(iconTestId);

    expect(title).toBeDefined();
    expect(icon).toBeDefined();
  });

  it('renders metadata', async () => {
    const { findByTestId } = renderTitleBlock({
      metadata: [
        { name: ElementName.CommentCount, testId: 'metadata-element' },
      ],
    });

    const element = await findByTestId('metadata-element');

    expect(element).toBeDefined();
  });

  it('renders subtitle', async () => {
    const { findByTestId } = renderTitleBlock({
      subtitle: [
        { name: ElementName.CommentCount, testId: 'subtitle-element' },
      ],
    });

    const element = await findByTestId('subtitle-element');

    expect(element).toBeDefined();
  });

  // Do not blindly add more actions here (like Download and Preview)
  const nonResolvedAllowedActions = [
    ActionName.EditAction,
    ActionName.DeleteAction,
    ActionName.CustomAction,
  ];

  for (const [status, allowedActionNames] of [
    [SmartLinkStatus.Resolved, Object.values(ActionName)],
    [SmartLinkStatus.Resolving, nonResolvedAllowedActions],
    [SmartLinkStatus.Forbidden, nonResolvedAllowedActions],
    [SmartLinkStatus.Errored, nonResolvedAllowedActions],
    [SmartLinkStatus.NotFound, nonResolvedAllowedActions],
    [SmartLinkStatus.Unauthorized, nonResolvedAllowedActions],
    [SmartLinkStatus.Fallback, nonResolvedAllowedActions],
  ] as [SmartLinkStatus, ActionName[]][]) {
    for (const allowedActionName of allowedActionNames) {
      it(`should render ${allowedActionName} action in ${status} view `, async () => {
        const testId = 'smart-element-test';

        const action =
          allowedActionName === ActionName.CustomAction
            ? makeCustomActionItem({
                testId: `${testId}-1`,
              })
            : {
                name: allowedActionName,
                testId: `${testId}-1`,
                onClick: () => {},
              };

        const { findByTestId } = renderTitleBlock({
          status,
          actions: [action],
        });

        const element = await findByTestId(`smart-element-test-1`);
        expect(element).toBeDefined();
      });
    }
  }

  // Uncomment and implement when new actions (like Download and preview) are added
  // it('should not render ___ action in non resolved view ___', () => {});

  it('should render only one action when on hover only activated', async () => {
    const testId = 'smart-element-test';
    const { findByTestId, queryByTestId } = renderTitleBlock({
      actions: [
        makeDeleteActionItem({ testId: `${testId}-1` }),
        makeCustomActionItem({ testId: `${testId}-2` }),
      ],
      showActionOnHover: true,
    });

    const moreButton = await findByTestId('action-group-more-button');
    expect(moreButton).toBeDefined();

    expect(queryByTestId(`smart-element-test-1`)).toBeNull();
    expect(queryByTestId(`smart-element-test-2`)).toBeNull();

    userEvent.click(moreButton);

    for (let i = 0; i < 2; i++) {
      const element = await findByTestId(`smart-element-test-${i + 1}`);
      expect(element).toBeDefined();
    }
  });

  describe('anchor link', () => {
    it('should render', async () => {
      const { findByTestId } = renderTitleBlock();

      const element = await findByTestId('smart-element-link');

      expect(element).toBeDefined();
      expect(element).toHaveAttribute('target', '_blank');
    });

    it('should have default target attribute', async () => {
      const { findByTestId } = renderTitleBlock();

      const element = await findByTestId('smart-element-link');

      expect(element).toHaveAttribute('target', '_blank');
    });

    it('should have custom target attribute', async () => {
      const { findByTestId } = renderTitleBlock({
        anchorTarget: '_self',
      });

      const element = await findByTestId('smart-element-link');

      expect(element).toHaveAttribute('target', '_self');
    });
  });

  describe('Title', () => {
    it.each([
      [SmartLinkStatus.Resolved],
      [SmartLinkStatus.Resolving],
      [SmartLinkStatus.Forbidden],
      [SmartLinkStatus.Errored],
      [SmartLinkStatus.NotFound],
      [SmartLinkStatus.Unauthorized],
      [SmartLinkStatus.Fallback],
    ])(
      'renders title element with parent props including text override in %s view ',
      async (status: SmartLinkStatus) => {
        const { findByTestId } = renderTitleBlock({
          status,
          theme: SmartLinkTheme.Black,
          maxLines: 2,
          text: 'Spaghetti',
        });

        const element = await findByTestId(titleTestId);
        expect(element.textContent).toEqual('Spaghetti');

        expect(element).toHaveStyleDeclaration(
          'color',
          expect.stringContaining('#44546F'),
        );
      },
    );
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
      const { findByTestId } = renderTitleBlock({ status });

      const element = await findByTestId(expectedTestId);

      expect(element).toBeDefined();
    });

    it('renders formatted message', async () => {
      const { findByTestId } = renderTitleBlock({
        status: SmartLinkStatus.NotFound,
        retry: { descriptor: messages.cannot_find_link },
      });

      const message = await findByTestId(
        'smart-block-title-errored-view-message',
      );

      expect(message.textContent).toEqual("Can't find link");
    });
  });

  describe('with css override', () => {
    it.each([
      [SmartLinkStatus.Errored, 'errored-view'],
      [SmartLinkStatus.Fallback, 'errored-view'],
      [SmartLinkStatus.Forbidden, 'errored-view'],
      [SmartLinkStatus.NotFound, 'errored-view'],
      [SmartLinkStatus.Pending, 'resolving-view'],
      [SmartLinkStatus.Resolved, 'resolved-view'],
      [SmartLinkStatus.Resolving, 'resolving-view'],
      [SmartLinkStatus.Unauthorized, 'errored-view'],
    ])(
      'renders %s view with override value',
      async (status: SmartLinkStatus, viewTestId: string) => {
        const overrideCss = css`
          background-color: blue;
        `;
        const { findByTestId } = renderTitleBlock({
          overrideCss,
          status,
          testId: 'css',
        });

        const block = await findByTestId(`css-${viewTestId}`);

        expect(block).toHaveStyleDeclaration('background-color', 'blue');
      },
    );
  });
});
