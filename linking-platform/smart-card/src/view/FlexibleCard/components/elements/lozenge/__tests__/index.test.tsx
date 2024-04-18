import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { css } from '@emotion/react';
import Lozenge from '../index';
import { LozengeProps } from '../types';
import { SmartLinkActionType } from '@atlaskit/linking-types';
import * as useInvoke from '../../../../../../state/hooks/use-invoke';
import * as useResolve from '../../../../../../state/hooks/use-resolve';

describe('Element: Lozenge', () => {
  const testId = 'smart-element-lozenge';
  const text = 'Some status';
  const appearance = 'inprogress';

  it('renders element', async () => {
    const { findByTestId } = render(
      <Lozenge text={text} appearance={appearance} />,
    );

    const element = await findByTestId(testId);

    expect(element).toBeTruthy();
    expect(element.textContent).toBe(text);
  });

  it('does not render when no text in element', async () => {
    const { queryByTestId } = render(
      <Lozenge text={''} appearance={appearance} />,
    );
    expect(queryByTestId(testId)).toBeNull();
  });

  describe('renders element with different appearances', () => {
    const appearances: Array<LozengeProps['appearance']> = [
      'default',
      'inprogress',
      'moved',
      'new',
      'removed',
      'success',
    ];
    for (const appearance of appearances) {
      it(`renders with ${appearance} appearance`, async () => {
        const { findByTestId } = render(
          <Lozenge text={text} appearance={appearance} />,
        );

        const element = await findByTestId(testId);

        expect(element).toBeTruthy();
        expect(element.textContent).toBe(text);
      });
    }
  });

  it('renders with default appearance when given an unexpected appearance', async () => {
    const { findByTestId } = render(
      <Lozenge text={text} appearance={'spaghetti' as any} />,
    );
    const element = await findByTestId(testId);
    expect(element).toBeTruthy();
    expect(element.textContent).toBe(text);
  });

  it('renders with override css', async () => {
    const overrideCss = css({
      fontStyle: 'italic',
    });
    const { findByTestId } = render(
      <Lozenge appearance={appearance} overrideCss={overrideCss} text={text} />,
    );

    const element = await findByTestId(testId);

    expect(element).toHaveStyleDeclaration('font-style', 'italic');
  });

  describe('action', () => {
    const triggerTestId = `${testId}--trigger`;
    const action = {
      read: {
        action: {
          actionType: SmartLinkActionType.GetStatusTransitionsAction,
          resourceIdentifiers: {
            issueKey: 'issue-id',
            hostname: 'some-hostname',
          },
        },
        providerKey: 'object-provider',
      },
      update: {
        action: {
          actionType: SmartLinkActionType.StatusUpdateAction,
          resourceIdentifiers: {
            issueKey: 'issue-id',
            hostname: 'some-hostname',
          },
        },
        providerKey: 'object-provider',
      },
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('renders with action', async () => {
      jest.spyOn(useInvoke, 'default').mockReturnValue(jest.fn());
      jest.spyOn(useResolve, 'default').mockReturnValue(jest.fn());

      const { findByTestId } = render(
        <Lozenge
          action={action}
          appearance={appearance}
          testId={testId}
          text={text}
        />,
      );

      const element = await findByTestId(triggerTestId);

      expect(element).toBeTruthy();
    });
  });
});
