import { Action } from 'redux';
import { SCREEN_EVENT_TYPE } from '@atlaskit/analytics-gas-types';
import { HandlerResult } from '.';
import { isSearchGiphyAction } from '../../actions/searchGiphy';

export default (action: Action): HandlerResult => {
  if (isSearchGiphyAction(action)) {
    return [
      {
        name: 'cloudBrowserModal',
        eventType: SCREEN_EVENT_TYPE,
        attributes: {
          cloudType: 'giphy',
        },
      },
    ];
  }
};
