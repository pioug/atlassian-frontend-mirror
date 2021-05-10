import React from 'react';

import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { ReactWrapper } from 'enzyme';

import { MediaType } from '@atlaskit/media-client';

import { defaultSchema } from '@atlaskit/adf-schema';
import { getDefaultMediaClientConfig } from '@atlaskit/media-test-helpers';

import { checkMediaType } from '../../../utils/check-media-type';
import { stateKey } from '../../../pm-plugins/plugin-key';

jest.mock('../../../utils/check-media-type', () => ({
  checkMediaType: jest.fn(),
}));

jest.mock('../../../pm-plugins/plugin-key', () => ({
  stateKey: {
    getState: jest.fn(),
  },
}));

import {
  LinkToolbarAppearance,
  LinkingToolbarProps,
} from '../../../toolbar/linking-toolbar-appearance';
import { IntlProvider } from 'react-intl';
import { EditorState } from 'prosemirror-state';

const waitForStateUpdate = async () => {
  // We need to wait for the end of the event loop to see the state update
  await Promise.resolve({});
};

import { MediaLinkingState } from '../../../pm-plugins/linking';

import { RefsNode } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  doc,
  mediaSingle,
  media,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { linkToolbarMessages } from '../../../../../messages';

const defaultMediaLinkingState: MediaLinkingState = {
  mediaPos: 1,
  link: '',
  editable: false,
  visible: true,
};

const defaultLink: string = 'http://www.google.com';
const selectors = {
  OPEN_LINK: `[href="${defaultLink}"]`,
  ADD_LINK: `button[aria-label="${linkToolbarMessages.addLink.defaultMessage}"]`,
  EDIT_LINK: `button[aria-label="${linkToolbarMessages.editLink.defaultMessage}"]`,
  BAD_LINK: `button[aria-label="${linkToolbarMessages.unableToOpenLink.defaultMessage}"]`,
};

const defaultDocNode = doc(
  mediaSingle({ layout: 'center' })(
    media({
      id: 'test-id',
      type: 'file',
      collection: 'test-collection',
      __fileMimeType: 'image/png',
    })(),
  ),
)(defaultSchema);

const intlProvider = new IntlProvider({
  locale: 'en',
});
const intl = intlProvider.getChildContext().intl;

const setup = async (
  doc: RefsNode = defaultDocNode,
  mediaLinkingState: MediaLinkingState = defaultMediaLinkingState,
  mediaType?: MediaType | 'external' | null,
  skipStateUpdate?: boolean,
): Promise<ReactWrapper<LinkingToolbarProps>> => {
  (stateKey.getState as jest.Mock).mockReturnValue({
    mediaClientConfig: getDefaultMediaClientConfig(),
  });
  (checkMediaType as jest.Mock).mockReturnValue(Promise.resolve(mediaType));

  const wrapper: ReactWrapper<LinkingToolbarProps> = mountWithIntl(
    <LinkToolbarAppearance
      editorState={EditorState.create({ doc })}
      intl={intl}
      mediaLinkingState={mediaLinkingState}
      onAddLink={jest.fn()}
      onEditLink={jest.fn()}
      onOpenLink={jest.fn()}
    />,
  );

  if (skipStateUpdate) {
    return wrapper;
  }

  await waitForStateUpdate();
  wrapper.update();

  return wrapper;
};

describe('linking-toolbar-appearance', () => {
  describe('image media', () => {
    it('should not show anything initially', async () => {
      const wrapper = await setup(
        defaultDocNode,
        defaultMediaLinkingState,
        'image',
        true,
      );

      expect(wrapper.find(selectors.ADD_LINK).exists()).toBe(false);
      expect(wrapper.find(selectors.OPEN_LINK).exists()).toBe(false);
      expect(wrapper.find(selectors.EDIT_LINK).exists()).toBe(false);
    });

    it('should show "add link" button', async () => {
      const wrapper = await setup(
        defaultDocNode,
        defaultMediaLinkingState,
        'image',
      );

      expect(wrapper.find(selectors.ADD_LINK).exists()).toBe(true);
      expect(wrapper.find(selectors.OPEN_LINK).exists()).toBe(false);
      expect(wrapper.find(selectors.EDIT_LINK).exists()).toBe(false);
    });

    it('should show "add link" button if media is external', async () => {
      const wrapper = await setup(
        defaultDocNode,
        defaultMediaLinkingState,
        'external',
      );

      expect(wrapper.find(selectors.ADD_LINK).exists()).toBe(true);
      expect(wrapper.find(selectors.OPEN_LINK).exists()).toBe(false);
      expect(wrapper.find(selectors.EDIT_LINK).exists()).toBe(false);
    });

    it('should show link and edit button when link is editable', async () => {
      const wrapper = await setup(
        defaultDocNode,
        {
          ...defaultMediaLinkingState,
          editable: true,
          link: defaultLink,
        },
        'external',
      );

      expect(wrapper.find(selectors.ADD_LINK).exists()).toBe(false);
      expect(wrapper.find(selectors.OPEN_LINK).exists()).toBe(true);
      expect(wrapper.find(selectors.EDIT_LINK).exists()).toBe(true);
    });

    it('should show unable to open link button when link is invalid', async () => {
      const wrapper = await setup(
        defaultDocNode,
        {
          ...defaultMediaLinkingState,
          editable: true,
          link: 'javascript://alert("hack")',
        },
        'external',
      );

      expect(wrapper.find(selectors.ADD_LINK).exists()).toBe(false);
      expect(wrapper.find(selectors.BAD_LINK).exists()).toBe(true);
      expect(wrapper.find(selectors.EDIT_LINK).exists()).toBe(true);
    });
  });

  it('should not show link controls if media type is video', async () => {
    const wrapper = await setup(
      defaultDocNode,
      defaultMediaLinkingState,
      'video',
    );

    expect(wrapper.find(selectors.ADD_LINK).exists()).toBe(false);
    expect(wrapper.find(selectors.OPEN_LINK).exists()).toBe(false);
    expect(wrapper.find(selectors.EDIT_LINK).exists()).toBe(false);
  });

  it('should not show link controls if media type unknown', async () => {
    const wrapper = await setup(defaultDocNode, defaultMediaLinkingState, null);

    expect(wrapper.find(selectors.ADD_LINK).exists()).toBe(false);
    expect(wrapper.find(selectors.OPEN_LINK).exists()).toBe(false);
    expect(wrapper.find(selectors.EDIT_LINK).exists()).toBe(false);
  });
});
