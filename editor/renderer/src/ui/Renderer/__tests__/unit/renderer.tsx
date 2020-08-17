import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import {
  AnnotationMarkStates,
  AnnotationTypes,
  AnnotationId,
} from '@atlaskit/adf-schema';
import {
  AnnotationState,
  AnnotationProviders,
  UnsupportedBlock,
  UnsupportedInline,
} from '@atlaskit/editor-common';
import RendererDefaultComponent, { Renderer } from '../../';
import { AnnotationSelection } from '../../../annotations/selection';
import { Paragraph } from '../../../../react/nodes';

describe('Renderer', () => {
  const annotationsId: string[] = ['id_1', 'id_2', 'id_3'];
  const adf = {
    version: 1,
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'rodrigo',
            marks: [
              {
                type: 'annotation',
                attrs: {
                  id: annotationsId[0],
                },
              },
            ],
          },
          {
            type: 'text',
            text: ' banana ',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'melao ',
          },
          {
            type: 'text',
            text: 'bola',
            marks: [
              {
                type: 'annotation',
                attrs: {
                  id: annotationsId[1],
                },
              },
              {
                type: 'annotation',
                attrs: {
                  id: annotationsId[2],
                },
              },
            ],
          },
        ],
      },
    ],
  };

  let getStateCallbackMock: jest.Mock;
  let annotationProvider: AnnotationProviders<AnnotationMarkStates>;
  beforeEach(() => {
    getStateCallbackMock = jest.fn();
    annotationProvider = {
      [AnnotationTypes.INLINE_COMMENT]: {
        getState: async (
          ids: AnnotationId[],
        ): Promise<
          AnnotationState<
            AnnotationTypes.INLINE_COMMENT,
            AnnotationMarkStates
          >[]
        > => {
          getStateCallbackMock(ids);
          return ids.map(id => ({
            id,
            annotationType: AnnotationTypes.INLINE_COMMENT,
            state: AnnotationMarkStates.ACTIVE,
          }));
        },

        selectionComponent: jest.fn(),
      },
    };
  });

  describe('annotationProvider', () => {
    it('should call the provider with ids inside of the document', () => {
      act(() => {
        mount(
          <Renderer
            annotationProvider={annotationProvider}
            document={adf}
            allowAnnotations
          />,
        );
      });

      expect(getStateCallbackMock).toHaveBeenCalledWith(annotationsId);
    });
  });

  describe('when the allowAnnotations is enabled', () => {
    it('should render the AnnotationSelection', () => {
      let wrapper: ReactWrapper;
      act(() => {
        wrapper = mount(
          <RendererDefaultComponent
            annotationProvider={annotationProvider}
            document={adf}
            allowAnnotations={true}
          />,
        );
      });

      expect(wrapper!.find(AnnotationSelection)).toHaveLength(1);
    });
  });

  describe('when the allowAnnotations is disabled', () => {
    it('should not render the AnnotationSelection', () => {
      let wrapper: ReactWrapper;
      act(() => {
        wrapper = mount(
          <RendererDefaultComponent
            annotationProvider={annotationProvider}
            document={adf}
            allowAnnotations={false}
          />,
        );
      });

      expect(wrapper!.find(AnnotationSelection)).toHaveLength(0);
    });
  });
});

describe('spec based validator', () => {
  it('should render unsupported content block when the document has invalid block', () => {
    const docWithInvalidBlock = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph1232',
          content: [
            {
              type: 'text',
              text: 'hello',
            },
          ],
        },
      ],
    };
    let wrapper: ShallowWrapper;
    act(() => {
      wrapper = shallow(
        <Renderer
          document={docWithInvalidBlock}
          useSpecBasedValidator={true}
        />,
      );
    });

    expect(wrapper!.find(UnsupportedBlock)).not.toHaveLength(0);
  });

  it('should NOT render unsupported content block when the document is valid', () => {
    const docWithValidParagraph = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'hello',
            },
          ],
        },
      ],
    };

    let wrapper: ShallowWrapper;
    act(() => {
      wrapper = shallow(
        <Renderer
          document={docWithValidParagraph}
          useSpecBasedValidator={true}
        />,
      );
    });

    expect(wrapper!.find(UnsupportedBlock)).toHaveLength(0);
    expect(wrapper!.find(Paragraph)).not.toHaveLength(0);
  });

  it('should render unsupported inline when the document has invalid inline', () => {
    const docWithInvalidInline = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'unknown type',
              attrs: {
                text: 'fallback text',
              },
            },
          ],
        },
      ],
    };

    let wrapper: ShallowWrapper;
    act(() => {
      wrapper = shallow(
        <Renderer
          document={docWithInvalidInline}
          useSpecBasedValidator={true}
        />,
      );
    });

    expect(wrapper!.find(UnsupportedInline)).not.toHaveLength(0);
  });

  it('should NOT render unsupported inline when the document has valid inline', () => {
    const docWithValidInline = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'mention',
              attrs: {
                id: '1',
                text: '@Oscar Wallhult',
              },
            },
          ],
        },
      ],
    };

    let wrapper: ShallowWrapper;
    act(() => {
      wrapper = shallow(
        <Renderer document={docWithValidInline} useSpecBasedValidator={true} />,
      );
    });

    expect(wrapper!.find(UnsupportedInline)).toHaveLength(0);
    expect(wrapper!.find(Paragraph)).not.toHaveLength(0);
  });
});
