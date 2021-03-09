import { Action } from 'redux';

import { isSearchGiphyAction } from '../../actions/searchGiphy';
import { HandlerResult } from '.';

export default (action: Action): HandlerResult => {
  if (isSearchGiphyAction(action)) {
    return [
      {
        eventType: 'screen',
        actionSubject: 'cloudBrowserModal',
        name: 'cloudBrowserModal',
        attributes: {
          cloudType: 'giphy',
        },
      },
    ];
  }
};
