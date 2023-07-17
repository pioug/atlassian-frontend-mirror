import { EditorView } from 'prosemirror-view';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { CardReplacementInputMethod } from '@atlaskit/editor-common/card';
import { CardProvider } from '@atlaskit/editor-common/provider-factory';
import { SmartCardContext } from '@atlaskit/link-provider';
import { CardAppearance } from '@atlaskit/smart-card';

import { EditorContext } from '../../nodeviews/genericCard';
import { setProvider } from '../../pm-plugins/actions';
import { Request } from '../../types';

export function createCardRequest(
  url: string,
  pos: number,
  {
    appearance = 'inline',
    compareLinkText = true,
    source = INPUT_METHOD.CLIPBOARD,
  }: {
    appearance?: CardAppearance;
    compareLinkText?: boolean;
    source?: CardReplacementInputMethod;
  } = {},
): Request {
  return { url, pos, appearance, compareLinkText, source };
}

export type ProviderWrapper = {
  addProvider(editorView: EditorView): void;
  waitForRequests(): Promise<any>;
  provider: CardProvider;
};

const paragraphAdf = {
  type: 'paragraph',
  content: [
    {
      type: 'text',
      text: 'hello world',
    },
  ],
};

export function setupProvider(cardAdf: object = paragraphAdf): ProviderWrapper {
  let promises: Promise<any>[] = [];
  let provider: CardProvider = new (class implements CardProvider {
    resolve(): Promise<any> {
      const promise = new Promise(resolve => resolve(cardAdf));
      promises.push(promise);
      return promise;
    }
    async findPattern(): Promise<boolean> {
      return true;
    }
  })();

  return {
    addProvider(editorView: EditorView) {
      const { dispatch } = editorView;
      dispatch(setProvider(provider)(editorView.state.tr));
    },

    waitForRequests() {
      return Promise.all([promises]);
    },

    get provider() {
      return provider;
    },
  };
}

export const createCardContext = (): EditorContext<any> => {
  return {
    ...SmartCardContext,
    value: {},
  };
};
