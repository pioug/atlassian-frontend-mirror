import React from 'react';
import { initialDoc } from '../../__fixtures__/initial-doc';
import Renderer, { Props } from '../../../ui/Renderer';
import { IntlProvider, InjectedIntlProps } from 'react-intl';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import Tooltip from '@atlaskit/tooltip';
import { ReactWrapper } from 'enzyme';

describe('Unsupported Content', () => {
  describe('Block Node', () => {
    let renderer: ReactWrapper<any & InjectedIntlProps, any, any>;
    afterEach(() => {
      renderer.unmount();
    });

    const doc = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'FooBarNode',
          attrs: {
            panelType: 'info',
          },
          content: [
            {
              type: 'paragraph',
              content: [],
            },
          ],
        },
      ],
    };

    const initRendererWithIntl = (
      doc: any = initialDoc,
      props: Partial<Props> = {},
      locale: string = 'en',
      messages = {},
    ) =>
      mountWithIntl(
        <IntlProvider locale={locale} messages={messages}>
          <Renderer document={doc} {...props} />
        </IntlProvider>,
      );

    it('should return a node of type div', () => {
      renderer = initRendererWithIntl(doc, {
        useSpecBasedValidator: true,
      });
      expect(
        renderer.find('UnsupportedBlockNode').getDOMNode().tagName,
      ).toEqual('DIV');
    });

    it('should node contains tooltip', () => {
      renderer = initRendererWithIntl(doc, {
        useSpecBasedValidator: true,
      });
      expect(renderer.find(Tooltip)).toHaveLength(1);
    });

    it('should show correct message when hover on tooltip', () => {
      renderer = initRendererWithIntl(doc, {
        useSpecBasedValidator: true,
      });
      expect(renderer.find(Tooltip).exists()).toBeTruthy();
      expect(renderer.find(Tooltip).props().content).toEqual(
        'Content is not available in this editor, this will be preserved when you edit and save',
      );
    });

    it(
      'should have text content as string "Unsupported content"' +
        ' when language non-english locale provided',
      () => {
        const messages = {
          'fabric.editor.unsupportedContent':
            'This editor does not support displaying this content',
        };

        renderer = initRendererWithIntl(
          doc,
          { useSpecBasedValidator: true },
          'de',
          messages,
        );
        expect(renderer.text()).toEqual(
          'This editor does not support displaying this content',
        );
      },
    );

    it(
      'should have text content as string "Unsupported Status"' +
        ' when language english locale provided',
      () => {
        renderer = initRendererWithIntl(doc, {
          useSpecBasedValidator: true,
        });
        expect(renderer.text()).toEqual(
          'This editor does not support displaying this content: FooBarNode',
        );
      },
    );
  });

  describe('Inline Node', () => {
    let renderer: ReactWrapper<any & InjectedIntlProps, any, any>;

    const doc = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'FooBarNode',
              attrs: {
                id: '0',
                texts: '@Carolyn',
                accessLevel: '',
              },
            },
          ],
        },
      ],
    };

    const initRendererWithIntl = (
      doc: any = initialDoc,
      props: Partial<Props> = {},
      locale: string = 'en',
      messages = {},
    ) =>
      mountWithIntl(
        <IntlProvider locale={locale} messages={messages}>
          <Renderer document={doc} {...props} />
        </IntlProvider>,
      );

    it('should return a node of type span', () => {
      renderer = initRendererWithIntl(doc, {
        useSpecBasedValidator: true,
      });
      expect(
        renderer.find('UnsupportedInlineNode').getDOMNode().tagName,
      ).toEqual('SPAN');
    });

    it('should node contains tooltip', () => {
      renderer = initRendererWithIntl(doc, {
        useSpecBasedValidator: true,
      });
      expect(renderer.find(Tooltip)).toHaveLength(1);
    });

    it('should show correct message when hover on tooltip', () => {
      renderer = initRendererWithIntl(doc, {
        useSpecBasedValidator: true,
      });
      expect(renderer.find(Tooltip).exists()).toBeTruthy();
      expect(renderer.find(Tooltip).props().content).toEqual(
        'Content is not available in this editor, this will be preserved when you edit and save',
      );
    });

    it(
      'should have text content as string "Unsupported content"' +
        ' when language non-english locale provided',
      () => {
        const messages = {
          'fabric.editor.unsupportedContent': 'Unsupported content',
        };

        renderer = initRendererWithIntl(
          doc,
          { useSpecBasedValidator: true },
          'de',
          messages,
        );
        expect(renderer.text()).toEqual('Unsupported content');
      },
    );

    it(
      'should have text content as string "Unsupported Status"' +
        ' when language english locale provided',
      () => {
        renderer = initRendererWithIntl(doc, {
          useSpecBasedValidator: true,
        });

        expect(renderer.text()).toEqual('Unsupported FooBarNode');
      },
    );
  });
});
