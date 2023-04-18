/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useCallback, useMemo, useState } from 'react';
import DropdownMenu, { DropdownItemGroup } from '@atlaskit/dropdown-menu';
import type { FC } from 'react';
import type { CustomTriggerProps } from '@atlaskit/dropdown-menu';

import LozengeActionItem from './lozenge-action-item';
import LozengeActionTrigger from './lozenge-action-trigger';
import LozengeActionError from './lozenge-action-error';
import withErrorBoundary from './error-boundary';
import { dropdownItemGroupStyles } from './styled';
import useInvoke from '../../../../../state/hooks/use-invoke';
import { InvokeActionError } from '../../../../../state/hooks/use-invoke/types';
import extractLozengeActionItems from '../../../../../extractors/action/extract-lozenge-action-items';
import type { LozengeActionProps, LozengeItem } from './types';
import createStatusUpdateRequest from '../../../../../utils/actions/create-status-update-request';
import useResolve from '../../../../../state/hooks/use-resolve';

const validateItems = (
  items: LozengeItem[] = [],
  text?: string,
): LozengeItem[] => {
  return items.filter((item) => item.text !== text);
};

const LozengeAction: FC<LozengeActionProps> = ({
  action,
  appearance,
  testId = 'smart-element-lozenge-action',
  text,
}) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [items, setItems] = useState<LozengeItem[]>();
  const [errorCode, setErrorCode] = useState<InvokeActionError>();

  const invoke = useInvoke();
  const reload = useResolve();

  const handleOpenChange = useCallback(
    async (args) => {
      setIsOpen(args.isOpen);

      if (args.isOpen && !isLoaded && action?.read) {
        try {
          setIsLoading(true);
          const responseItems = await invoke(
            action.read,
            extractLozengeActionItems,
          );
          const validItems = validateItems(responseItems, text);

          setItems(validItems);
          setIsLoaded(true);

          if (validItems?.length === 0) {
            setErrorCode(InvokeActionError.NoData);
          }
        } catch (err) {
          // TODO: EDM-6261: Error state
          setErrorCode(InvokeActionError.Unknown);
        } finally {
          setIsLoading(false);
        }
      }

      if (!args.isOpen) {
        setErrorCode(undefined);
      }
    },
    [action?.read, invoke, isLoaded, text],
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

  const handleItemClick = useCallback(
    async (id: string) => {
      try {
        const updateAction = action?.update;
        if (updateAction && id) {
          setIsLoading(true);

          const request = createStatusUpdateRequest(updateAction, id);
          await invoke(request);

          setIsLoading(false);
          setIsOpen(false);

          const { url, id: linkId } = updateAction.details || {};
          if (url) {
            await reload(url, true, undefined, linkId);
          }
        }
      } catch (err) {
        // TODO: EDM-6261: Error state
        setIsLoading(false);
        setErrorCode(InvokeActionError.Unknown);
      }
    },
    [action?.update, invoke, reload],
  );

  const dropdownItemGroup = useMemo(() => {
    if (errorCode) {
      return <LozengeActionError errorCode={errorCode} testId={testId} />;
    }

    if (items && items.length > 0) {
      return (
        <span
          css={dropdownItemGroupStyles}
          data-testid={`${testId}-item-group`}
        >
          <DropdownItemGroup>
            {items.map((item, idx) => (
              <LozengeActionItem
                {...item}
                key={idx}
                onClick={handleItemClick}
                testId={`${testId}-item-${idx}`}
              />
            ))}
          </DropdownItemGroup>
        </span>
      );
    }
  }, [errorCode, handleItemClick, items, testId]);

  return (
    <DropdownMenu
      isLoading={isLoading}
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      testId={testId}
      trigger={trigger}
    >
      {dropdownItemGroup}
    </DropdownMenu>
  );
};

export default withErrorBoundary(LozengeAction);
