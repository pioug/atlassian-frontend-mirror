/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useCallback, useMemo, useState } from 'react';
import DropdownMenu, { DropdownItemGroup } from '@atlaskit/dropdown-menu';
import LozengeActionItem from './lozenge-action-item';
import LozengeActionTrigger from './lozenge-action-trigger';
import LozengeActionError from './lozenge-action-error';
import withErrorBoundary from './error-boundary';
import useInvoke from '../../../../../state/hooks/use-invoke';
import { InvokeActionError } from '../../../../../state/hooks/use-invoke/types';
import { dropdownItemGroupStyles } from './styled';

import type { FC } from 'react';
import type { CustomTriggerProps } from '@atlaskit/dropdown-menu';
import type { LozengeActionProps, LozengeItem } from './types';

const LozengeAction: FC<LozengeActionProps> = ({
  action,
  appearance,
  testId = 'smart-element-lozenge-action',
  text,
}) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [items, setItems] = useState<LozengeItem[]>();
  const [errorCode, setErrorCode] = useState<InvokeActionError>();

  const invoke = useInvoke();

  const onOpenChange = useCallback(
    async (args) => {
      if (args.isOpen && !isLoaded && action) {
        try {
          setIsLoading(true);
          const lozengeItems = (await invoke<LozengeItem[]>(action)) || [];
          setItems(lozengeItems);
          setIsLoaded(true);

          if (lozengeItems.length === 0) {
            setErrorCode(InvokeActionError.NoData);
          }
        } catch (err) {
          // TODO: EDM-5746 and EDM-5782
          setErrorCode(InvokeActionError.Unknown);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [action, invoke, isLoaded],
  );

  const trigger = useCallback(
    (props: CustomTriggerProps<HTMLButtonElement>) => (
      <LozengeActionTrigger
        {...props}
        appearance={appearance}
        testId={testId}
        text={text}
      />
    ),
    [appearance, testId, text],
  );

  const dropdownItemGroup = useMemo(() => {
    if (items && items.length > 0) {
      return (
        <span css={dropdownItemGroupStyles}>
          <DropdownItemGroup>
            {items.map(({ appearance, text }, idx) => (
              <LozengeActionItem
                appearance={appearance}
                key={idx}
                testId={`${testId}-item-${idx}`}
                text={text}
              />
            ))}
          </DropdownItemGroup>
        </span>
      );
    }

    if (errorCode) {
      return <LozengeActionError errorCode={errorCode} testId={testId} />;
    }
  }, [errorCode, items, testId]);

  return (
    <DropdownMenu
      isLoading={isLoading}
      onOpenChange={onOpenChange}
      testId={testId}
      trigger={trigger}
    >
      {dropdownItemGroup}
    </DropdownMenu>
  );
};

export default withErrorBoundary(LozengeAction);
