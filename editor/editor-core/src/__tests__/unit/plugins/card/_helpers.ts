import { EditorView } from 'prosemirror-view';
import { CardAppearance, SmartCardContext } from '@atlaskit/smart-card';
import { INPUT_METHOD } from '../../../../plugins/analytics';
import { setProvider } from '../../../../plugins/card/pm-plugins/actions';
import {
  CardReplacementInputMethod,
  Request,
} from '../../../../plugins/card/types';
import { CardProvider } from '@atlaskit/editor-common/provider-factory';
import { EditorContext } from '../../../../plugins/card/nodeviews/genericCard';

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
      const promise = new Promise((resolve) => resolve(cardAdf));
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
