import React, { useCallback, useState } from 'react';

import useInvoke from '../../../../../../state/hooks/use-invoke';
import useResolve from '../../../../../../state/hooks/use-resolve';
import createInvokeRequest from '../../../../../../utils/actions/create-invoke-request';
import Action from '../index';
import { ServerActionProps } from './types';

const ServerAction: React.FC<ServerActionProps> = ({
  action,
  onClick,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const invoke = useInvoke();
  const reload = useResolve();

  const handleClick = useCallback(async () => {
    if (action) {
      try {
        setIsLoading(true);

        const request = createInvokeRequest(action);
        await invoke(request);

        if (action.reload && action.reload.url) {
          await reload(action.reload.url, true, undefined, action.reload.id);
        }

        setIsLoading(false);

        if (onClick) {
          onClick();
        }
      } catch (err: any) {
        setIsLoading(false);
      }
    }
  }, [action, invoke, onClick, reload]);

  return <Action {...props} isLoading={isLoading} onClick={handleClick} />;
};

export default ServerAction;
