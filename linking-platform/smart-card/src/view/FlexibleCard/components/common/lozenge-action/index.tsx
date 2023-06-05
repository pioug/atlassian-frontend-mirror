/** @jsx jsx */
import { jsx } from '@emotion/react';
import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CustomTriggerProps } from '@atlaskit/dropdown-menu';
import DropdownMenu, { DropdownItemGroup } from '@atlaskit/dropdown-menu';
import type { ThemeAppearance } from '@atlaskit/lozenge';

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
import { useFlexibleUiAnalyticsContext } from '../../../../../state/flexible-ui-context';
import type { LozengeActionTriggerProps } from './lozenge-action-trigger/type';
import { TrackQuickActionType } from '../../../../../utils/analytics/analytics';
import {
  permissionLoadErrorAnalyticsPayload,
  unknownLoadErrorAnalyticsPayload,
  unknownUpdateErrorAnalyticsPayload,
  validationUpdateErrorAnalyticsPayload,
} from './lozenge-action-analytics';

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
  const [selected, setSelected] = useState<Partial<LozengeActionTriggerProps>>({
    appearance,
    text,
  });
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [items, setItems] = useState<LozengeItem[]>();
  const [errorMessage, setErrorMessage] = useState<string | MessageProps>();

  const reload = useResolve();
  //TODO EDM-6583 Replace usage of useFlexibleUiAnalyticsContext with linking platform analytics context from find team.
  const analytics = useFlexibleUiAnalyticsContext();
  const invoke = useInvoke();
  useEffect(() => {
    setSelected({ text, appearance });
  }, [text, appearance]);

  const { url, id: linkId, previewData } = action?.update?.details || {};

  const handleOpenChange = useCallback(
    async (args) => {
      setIsOpen(args.isOpen);
      if (args.isOpen) {
        analytics?.ui.smartLinkLozengeActionClickedEvent();
        analytics?.track.smartLinkQuickActionStarted({
          smartLinkActionType: TrackQuickActionType.StatusUpdate,
        });

        if (!isLoaded && action?.read) {
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
              analytics?.track.smartLinkQuickActionFailed(
                permissionLoadErrorAnalyticsPayload,
              );

              setErrorMessage(LozengeActionErrorMessages.noData);
              setIsLoaded(false);
            }
          } catch (err) {
            setErrorMessage(LozengeActionErrorMessages.unknown);
            setIsLoaded(false);

            analytics?.track.smartLinkQuickActionFailed(
              unknownLoadErrorAnalyticsPayload,
            );
          } finally {
            setIsLoading(false);
          }
        }
      }

      if (!args.isOpen) {
        setErrorMessage(undefined);
      }
    },
    [action.read, analytics, invoke, isLoaded, text],
  );

  const trigger = useCallback(
    (props: CustomTriggerProps<HTMLButtonElement>) => (
      <LozengeActionTrigger
        {...props}
        appearance={selected.appearance}
        showFeatureDiscovery={action?.showFeatureDiscovery}
        testId={testId}
        text={selected.text}
      />
    ),
    [selected.appearance, selected.text, action?.showFeatureDiscovery, testId],
  );

  const handleItemClick = useCallback(
    async (id: string, text: string, appearance?: ThemeAppearance) => {
      try {
        analytics?.ui.smartLinkLozengeActionListItemClickedEvent();
        const updateAction = action?.update;
        if (updateAction && id) {
          setIsLoading(true);

          const request = createStatusUpdateRequest(updateAction, id);
          await invoke(request);

          setSelected({ appearance, text });
          setIsLoading(false);
          setIsLoaded(false);
          setIsOpen(false);
          setItems([]);

          analytics?.track.smartLinkQuickActionSuccess({
            smartLinkActionType: TrackQuickActionType.StatusUpdate,
          });

          if (url) {
            await reload(url, true, undefined, linkId);
          }
        }
      } catch (err: any) {
        setIsLoading(false);

        if (isInvokeCustomError(err)) {
          setErrorMessage(err.message);
          analytics?.track.smartLinkQuickActionFailed(
            validationUpdateErrorAnalyticsPayload,
          );
        } else {
          setErrorMessage(LozengeActionErrorMessages.updateFailed);
          analytics?.track.smartLinkQuickActionFailed(
            unknownUpdateErrorAnalyticsPayload,
          );
        }
      }
    },
    [action?.update, analytics, invoke, linkId, reload, url],
  );

  const dropdownItemGroup = useMemo(() => {
    if (errorMessage) {
      return (
        <LozengeActionError
          errorMessage={errorMessage}
          testId={testId}
          url={url}
          previewData={previewData}
        />
      );
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
  }, [errorMessage, handleItemClick, items, previewData, testId, url]);

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
