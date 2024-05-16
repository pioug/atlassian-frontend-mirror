import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { css } from '@emotion/react';
import TitleBlock from '../index';
import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { FlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import {
  ActionName,
  ElementName,
  SmartLinkSize,
  SmartLinkStatus,
  SmartLinkTheme,
} from '../../../../../../constants';
import { type TitleBlockProps } from '../types';
import { messages } from '../../../../../../messages';
import {
  makeCustomActionItem,
  makeDeleteActionItem,
} from '../../../../../../../examples/utils/flexible-ui';
import { type NamedActionItem } from '../../types';
import { SmartCardProvider } from '@atlaskit/link-provider';

describe('TitleBlock', () => {
  const testId = 'smart-block-title-resolved-view';
  const titleTestId = 'smart-element-link';
  const iconTestId = 'smart-element-icon';

  const renderTitleBlock = (props?: TitleBlockProps) => {
    return render(
      <IntlProvider locale="en">
        <SmartCardProvider>
          <FlexibleUiContext.Provider value={context}>
            <TitleBlock status={SmartLinkStatus.Resolved} {...props} />
          </FlexibleUiContext.Provider>
        </SmartCardProvider>
      </IntlProvider>,
    );
  };
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

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

  describe('with actions', () => {
    // Do not blindly add more actions here (like Download and Preview)
    const nonResolvedAllowedActions = [
      ActionName.EditAction,
      ActionName.DeleteAction,
      ActionName.CustomAction,
    ];

    for (const [status, allowedActionNames] of [
      [
        SmartLinkStatus.Resolved,
        /**
         * Remove filter once ActionName.ViewAction is retired
         * https://product-fabric.atlassian.net/browse/EDM-9665
         */
        Object.values(ActionName).filter((x) => (x !== ActionName.ViewAction)),
      ],
      [SmartLinkStatus.Resolving, nonResolvedAllowedActions],
      [SmartLinkStatus.Forbidden, nonResolvedAllowedActions],
      [SmartLinkStatus.Errored, nonResolvedAllowedActions],
      [SmartLinkStatus.NotFound, nonResolvedAllowedActions],
      [SmartLinkStatus.Unauthorized, nonResolvedAllowedActions],
      [SmartLinkStatus.Fallback, nonResolvedAllowedActions],
      /**
       * Change Exclude<...>[] to ActionName[] once ActionName.ViewAction is retired
       * This is a typescript workaround
       * https://product-fabric.atlassian.net/browse/EDM-9665
       */
    ] as [SmartLinkStatus, Exclude<ActionName, ActionName.ViewAction>[]][]) {
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

      await user.click(moreButton);

      for (let i = 0; i < 2; i++) {
        const element = await findByTestId(`smart-element-test-${i + 1}`);
        expect(element).toBeDefined();
      }
    });

    describe('with onActionMenuOpenChange', () => {
      const actionTestId = 'test-action';
      const onActionMenuOpenChange = jest.fn();

      const getAction = (
        props?: Partial<NamedActionItem>,
      ): NamedActionItem => ({
        name: ActionName.DeleteAction,
        onClick: () => {},
        ...props,
      });

      afterEach(() => {
        onActionMenuOpenChange.mockClear();
      });

      it('calls onActionMenuOpenChange when action dropdown menu is present', async () => {
        const { findByTestId } = renderTitleBlock({
          actions: [getAction(), getAction(), getAction()],
          onActionMenuOpenChange,
        });

        // Open the action dropdown menu
        const moreButton = await findByTestId('action-group-more-button');
        await user.click(moreButton);
        expect(onActionMenuOpenChange).toHaveBeenCalledWith({ isOpen: true });

        // Close the action dropdown menu
        await user.click(moreButton);
        expect(onActionMenuOpenChange).toHaveBeenCalledWith({ isOpen: false });
      });

      it('calls onActionMenuOpenChange when action button is clicked', async () => {
        const { findByTestId } = renderTitleBlock({
          actions: [
            getAction({ testId: actionTestId }),
            getAction(),
            getAction(),
          ],
          onActionMenuOpenChange,
        });

        // Open the action dropdown menu
        const moreButton = await findByTestId('action-group-more-button');
        await user.click(moreButton);
        expect(onActionMenuOpenChange).toHaveBeenCalledWith({ isOpen: true });

        // Click on the action button outside action dropdown menu
        const action = await findByTestId(actionTestId);
        await user.click(action);
        expect(onActionMenuOpenChange).toHaveBeenCalledWith({ isOpen: false });
      });

      it('calls onActionMenuOpenChange when action dropdown menu item is clicked', async () => {
        const { findByTestId } = renderTitleBlock({
          actions: [
            getAction(),
            getAction(),
            getAction({ testId: actionTestId }),
          ],
          onActionMenuOpenChange,
        });

        // Open the action dropdown menu
        const moreButton = await findByTestId('action-group-more-button');
        await user.click(moreButton);
        expect(onActionMenuOpenChange).toHaveBeenCalledWith({ isOpen: true });

        // Click on the action dropdown menu item
        const action = await findByTestId(actionTestId);
        await user.click(action);
        expect(onActionMenuOpenChange).toHaveBeenCalledWith({ isOpen: false });
      });

      it('calls onActionMenuOpenChange when dropdown menu is closed', async () => {
        const { findByTestId } = renderTitleBlock({
          actions: [getAction(), getAction(), getAction()],
          onActionMenuOpenChange,
        });

        // Open the action dropdown menu
        const moreButton = await findByTestId('action-group-more-button');
        await user.click(moreButton);
        expect(onActionMenuOpenChange).toHaveBeenCalledWith({ isOpen: true });

        // Click on the action button outside action dropdown menu
        const title = await findByTestId(titleTestId);
        await user.click(title);
        expect(onActionMenuOpenChange).toHaveBeenCalledWith({ isOpen: false });
      });

      it('does not call onActionMenuOpenChange when there is no dropdown menu', async () => {
        const onActionMenuOpenChange = jest.fn();
        const { findByTestId } = renderTitleBlock({
          actions: [getAction({ testId: actionTestId })],
          onActionMenuOpenChange,
        });

        const action = await findByTestId(actionTestId);
        await user.click(action);
        expect(onActionMenuOpenChange).not.toHaveBeenCalled();
      });
    });
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
        anchorTarget: '_top',
      });

      const element = await findByTestId('smart-element-link');

      expect(element).toHaveAttribute('target', '_top');
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

    it("doesn't renders formatted message", async () => {
      const { queryByTestId } = renderTitleBlock({
        status: SmartLinkStatus.NotFound,
        retry: { descriptor: messages.cannot_find_link },
        hideRetry: true,
      });

      const message = queryByTestId('smart-block-title-errored-view-message');

      expect(message).toBeNull();
    });
  });

  describe('Icon', () => {
    it('should show Link Icon when hideIcon is false in resolved state', async () => {
      const { findByTestId } = renderTitleBlock({
        hideIcon: false,
      });

      const element = await findByTestId('smart-element-icon');

      expect(element).toBeDefined();
    });

    it('should show Link Icon when hideIcon is not set in resolved state', async () => {
      const { findByTestId } = renderTitleBlock();

      const element = await findByTestId('smart-element-icon');

      expect(element).toBeDefined();
    });

    it('should not show Link Icon when hideIcon is true in resolved state', async () => {
      const { queryByTestId } = renderTitleBlock({
        hideIcon: true,
      });

      const element = queryByTestId('smart-element-icon');

      expect(element).toBeNull();
    });

    it('should show Link Icon when hideIcon is false in loading state', async () => {
      const { queryByTestId } = renderTitleBlock({
        hideIcon: false,
        status: SmartLinkStatus.Resolving,
      });

      const element = queryByTestId(`${iconTestId}-icon-loading`);

      expect(element).toBeDefined();
    });

    it('should show Link Icon when hideIcon is not set in loading state', async () => {
      const { queryByTestId } = renderTitleBlock({
        status: SmartLinkStatus.Resolving,
      });

      const element = queryByTestId(`${iconTestId}-icon-loading`);

      expect(element).toBeDefined();
    });

    it('should not show Link Icon when hideIcon is true in loading state', async () => {
      const { queryByTestId } = renderTitleBlock({
        hideIcon: true,
        status: SmartLinkStatus.Resolving,
      });

      const element = queryByTestId(`${iconTestId}-icon-loading`);

      expect(element).toBeNull();
    });

    it('should show Link Icon when hideIcon is false in error state', async () => {
      const { queryByTestId } = renderTitleBlock({
        hideIcon: false,
        status: SmartLinkStatus.Errored,
      });

      const element = queryByTestId('smart-element-icon');

      expect(element).toBeDefined();
    });

    it('should show Link Icon when hideIcon is not set in error state', async () => {
      const { queryByTestId } = renderTitleBlock({
        status: SmartLinkStatus.Errored,
      });

      const element = queryByTestId('smart-element-icon');

      expect(element).toBeDefined();
    });

    it('should not show Link Icon when hideIcon is true in error state', async () => {
      const { queryByTestId } = renderTitleBlock({
        hideIcon: true,
        status: SmartLinkStatus.Errored,
      });

      const element = queryByTestId('smart-element-icon');

      expect(element).toBeNull();
    });
  });

  describe('renders with tooltip on title', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('shows tooltip on hover by default', async () => {
      const { findByTestId } = renderTitleBlock();

      const element = await findByTestId(titleTestId);
      fireEvent.mouseOver(element);
      jest.runAllTimers();
      const tooltip = await findByTestId(`${titleTestId}-tooltip`);

      expect(tooltip).toBeInTheDocument();
      expect(tooltip.textContent).toBe(context.title);
    });

    it('shows tooltip on hover when hideTitleTooltip is false', async () => {
      const { findByTestId } = renderTitleBlock({ hideTitleTooltip: false });

      const element = await findByTestId(titleTestId);
      fireEvent.mouseOver(element);
      jest.runAllTimers();
      const tooltip = await findByTestId(`${titleTestId}-tooltip`);

      expect(tooltip).toBeInTheDocument();
      expect(tooltip.textContent).toBe(context.title);
    });

    it('does not show tooltip on hover when hideTitleTooltip is true', async () => {
      const { findByTestId, queryByTestId } = renderTitleBlock({
        hideTitleTooltip: true,
      });

      const element = await findByTestId(titleTestId);
      fireEvent.mouseOver(element);
      jest.runAllTimers();
      const tooltip = queryByTestId(`${titleTestId}-tooltip`);

      expect(tooltip).not.toBeInTheDocument();
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
        const overrideCss = css({
          backgroundColor: 'blue',
        });
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

  describe('with loading skeleton', () => {
    it.each([
      [SmartLinkSize.XLarge, '2rem'],
      [SmartLinkSize.Large, '1.5rem'],
      [SmartLinkSize.Medium, '1rem'],
      [SmartLinkSize.Small, '.75rem'],
    ])('renders by size %s', async (size: SmartLinkSize, dimension: string) => {
      const { findByTestId } = renderTitleBlock({
        size,
        status: SmartLinkStatus.Resolving,
      });

      const icon = await findByTestId('smart-block-title-icon');
      const loadingSkeleton = await findByTestId(
        'smart-block-title-icon-loading',
      );

      expect(icon).toHaveStyleDeclaration('width', dimension);
      expect(icon).toHaveStyleDeclaration('height', dimension);
      expect(loadingSkeleton).toBeDefined();
    });
  });
});
