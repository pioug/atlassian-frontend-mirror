/** @jsx jsx */
import { jsx } from '@emotion/react';
import type { FC } from 'react';
import { useCallback, useMemo, useState } from 'react';
import type { CustomTriggerProps } from '@atlaskit/dropdown-menu';
import DropdownMenu, { DropdownItemGroup } from '@atlaskit/dropdown-menu';

import LozengeActionItem from './lozenge-action-item';
import LozengeActionTrigger from './lozenge-action-trigger';
import LozengeActionError from './lozenge-action-error';
import withErrorBoundary from './error-boundary';
import { dropdownItemGroupStyles } from './styled';
import useInvoke from '../../../../../state/hooks/use-invoke';
import extractLozengeActionItems from '../../../../../extractors/action/extract-lozenge-action-items';
import type { LozengeActionProps, LozengeItem } from './types';
import createStatusUpdateRequest from '../../../../../utils/actions/create-status-update-request';
import useResolve from '../../../../../state/hooks/use-resolve';
import { MessageProps } from '../../types';
import { LozengeActionErrorMessages } from './lozenge-action-error/types';
import { InvokeError } from '@atlaskit/linking-types/smart-link-actions';

const validateItems = (
  items: LozengeItem[] = [],
  text?: string,
): LozengeItem[] => {
  return items.filter((item) => item.text !== text);
};

const isInvokeCustomError = (err: InvokeError | Error): err is InvokeError =>
  (err as InvokeError).message !== undefined &&
  (err as InvokeError).errorCode !== undefined;

const LozengeAction: FC<LozengeActionProps> = ({
  action,
  appearance,
  testId = 'smart-element-lozenge-action',
  text,
  zIndex,
}) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [items, setItems] = useState<LozengeItem[]>();
  const [errorMessage, setErrorMessage] = useState<string | MessageProps>();

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
          const validItems =
            typeof text === 'string'
              ? validateItems(responseItems, text)
              : responseItems;

          setItems(validItems);
          setIsLoaded(true);

          if (validItems?.length === 0) {
            setErrorMessage(LozengeActionErrorMessages.noData);
            setIsLoaded(false);
          }
        } catch (err) {
          setErrorMessage(LozengeActionErrorMessages.unknown);
          setIsLoaded(false);
        } finally {
          setIsLoading(false);
        }
      }

      if (!args.isOpen) {
        setErrorMessage(undefined);
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
          setIsLoaded(false);
          setIsOpen(false);
          setItems([]);

          const { url, id: linkId } = updateAction.details || {};
          if (url) {
            await reload(url, true, undefined, linkId);
          }
        }
      } catch (err: any) {
        setIsLoading(false);

        if (isInvokeCustomError(err)) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage(LozengeActionErrorMessages.updateFailed);
        }
      }
    },
    [action?.update, invoke, reload],
  );

  const dropdownItemGroup = useMemo(() => {
    if (errorMessage) {
      return <LozengeActionError errorMessage={errorMessage} testId={testId} />;
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
  }, [errorMessage, handleItemClick, items, testId]);

  return (
    <DropdownMenu
      isLoading={isLoading}
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      testId={testId}
      trigger={trigger}
      zIndex={zIndex}
    >
      {dropdownItemGroup}
    </DropdownMenu>
  );
};

export default withErrorBoundary(LozengeAction);
