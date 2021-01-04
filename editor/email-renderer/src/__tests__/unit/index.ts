import EmailSerializer, { EmailSerializerOpts } from '../..';
import { defaultSchema as schema } from '@atlaskit/adf-schema';
import MockDate from 'mockdate';

import * as paragraphIndents from './__fixtures__/paragraph-indents.adf.json';
import * as paragraphAlign from './__fixtures__/paragraph-align.adf.json';
import * as heading from './__fixtures__/heading.adf.json';
import * as headingAlign from './__fixtures__/heading-align.adf.json';
import * as em from './__fixtures__/em.adf.json';
import * as codeBlock from './__fixtures__/code-block.adf.json';
import * as mention from './__fixtures__/mention.adf.json';
import * as inlineCodeProps from './__fixtures__/inline-code-props.adf.json';
import * as inlineTextProps from './__fixtures__/inline-text-props.adf.json';
import * as panels from './__fixtures__/panels.adf.json';
import * as link from './__fixtures__/link.adf.json';
import * as decisionList from './__fixtures__/decision-list.adf.json';
import * as taskList from './__fixtures__/task-list.adf.json';
import * as nestedTaskList from './__fixtures__/nested-task-list.adf.json';
import * as blockCards from './__fixtures__/block-cards.adf.json';
import * as inlineCards from './__fixtures__/inline-cards.adf.json';
import * as embedCards from './__fixtures__/embed-cards.adf.json';
import * as status from './__fixtures__/status.adf.json';
import * as tableNumberedColumn from './__fixtures__/table-numbered-column.adf.json';
import * as layoutColumnSection from './__fixtures__/layout-column-section.adf.json';
import * as extensions from './__fixtures__/extensions.adf.json';
import * as date from './__fixtures__/date.adf.json';
import * as mediaSingle from './__fixtures__/media-single.adf.json';
import * as mediaGroup from './__fixtures__/media-group.adf.json';
import * as mediaGroupAllTypes from './__fixtures__/media-group-all-types.adf.json';
import * as lists from './__fixtures__/lists.adf.json';
import * as text from './__fixtures__/text.adf.json';
import * as expand from './__fixtures__/expand.adf.json';

import * as image from './__fixtures__/image.adf.json';
import * as placeholder from './__fixtures__/placeholder.adf.json';
import * as annotation from './__fixtures__/annotation.adf.json';
import * as breakout from './__fixtures__/breakout.adf.json';
import { MetaDataContext } from '../../interfaces';

const defaultTestOpts: EmailSerializerOpts = {
  isImageStubEnabled: false,
  isInlineCSSEnabled: true,
};

const render = (
  doc: any,
  serializerOptions: Partial<EmailSerializerOpts> = {},
  context?: MetaDataContext,
) => {
  const opts = {
    ...defaultTestOpts,
    ...serializerOptions,
  };
  const serializer = new EmailSerializer(schema, opts);
  const docFromSchema = schema.nodeFromJSON(doc);
  const { result, embeddedImages } = serializer.serializeFragmentWithImages(
    docFromSchema.content,
    context,
  );
  const node = document.createElement('div');
  node.innerHTML = result!;
  return {
    result: node.firstChild,
    embeddedImages,
  };
};

describe('EmailSerializer constructor', () => {
  MockDate.reset();
  it('should initialize with default values', () => {
    const s = new EmailSerializer(schema);
    expect(s.opts).toEqual({
      isImageStubEnabled: false,
      isInlineCSSEnabled: false,
    });
  });
  it('should override default values', () => {
    const s = new EmailSerializer(schema, { isInlineCSSEnabled: true });
    expect(s.opts).toEqual({
      isImageStubEnabled: false,
      isInlineCSSEnabled: true,
    });
  });
});

describe('Renderer - EmailSerializer', () => {
  it('should render nothing for image node', () => {
    const { result } = render(image);
    expect(result).toMatchSnapshot('html');
  });

  it('should render nothing for placeholder node', () => {
    const { result } = render(placeholder);
    expect(result).toMatchSnapshot('html');
  });

  it('should apply no mark for annotation marks', () => {
    const { result } = render(annotation);
    expect(result).toMatchSnapshot('html');
  });

  it('should apply no mark for breakout marks', () => {
    const { result } = render(breakout);
    expect(result).toMatchSnapshot('html');
  });

  it('should render media single correctly', () => {
    const { result } = render(mediaSingle);
    expect(result).toMatchSnapshot('html');
  });

  it('should render media group correctly', () => {
    const { result } = render(mediaGroup);
    expect(result).toMatchSnapshot('html');
  });

  it('should render decision list correctly', () => {
    const { result, embeddedImages } = render(decisionList);
    expect(result).toMatchSnapshot('html');
    expect(embeddedImages).toMatchSnapshot('embeddedImages');
  });

  it('should render decision list correctly with mock enabled', () => {
    const { result, embeddedImages } = render(decisionList, {
      isImageStubEnabled: true,
    });
    expect(result).toMatchSnapshot('mock-html');
    expect(embeddedImages).toMatchSnapshot('mock-embeddedImages');
  });

  it('should render task list correctly', () => {
    const { result, embeddedImages } = render(taskList);
    expect(result).toMatchSnapshot('html');
    expect(embeddedImages).toMatchSnapshot('embeddedImages');
  });

  it('should render task list correctly with mock enabled', () => {
    const { result, embeddedImages } = render(taskList, {
      isImageStubEnabled: true,
    });
    expect(result).toMatchSnapshot('mock-html');
    expect(embeddedImages).toMatchSnapshot('mock-embeddedImages');
  });

  it('should render nested task list correctly', () => {
    const { result, embeddedImages } = render(nestedTaskList);
    expect(result).toMatchSnapshot('html');
    expect(embeddedImages).toMatchSnapshot('embeddedImages');
  });

  it('should render nested task list correctly with mock enabled', () => {
    const { result, embeddedImages } = render(nestedTaskList, {
      isImageStubEnabled: true,
    });
    expect(result).toMatchSnapshot('mock-html');
    expect(embeddedImages).toMatchSnapshot('mock-embeddedImages');
  });

  it('should render block cards correctly', () => {
    const { result } = render(blockCards);
    expect(result).toMatchSnapshot('html');
  });

  it('should render inline cards correctly', () => {
    const { result } = render(inlineCards);
    expect(result).toMatchSnapshot('html');
  });

  it('should render embed cards correctly', () => {
    const { result } = render(embedCards);
    expect(result).toMatchSnapshot('html');
  });

  it('should render text with em inside of a paragraph correctly', () => {
    const { result } = render(em);
    expect(result).toMatchSnapshot('html');
  });

  it('should render panels correctly', () => {
    const { result, embeddedImages } = render(panels);
    expect(result).toMatchSnapshot('html');
    expect(embeddedImages).toMatchSnapshot('embeddedImages');
  });

  it('should render panels correctly with mock enabled', () => {
    const { result, embeddedImages } = render(panels, {
      isImageStubEnabled: true,
    });
    expect(result).toMatchSnapshot('mock-html');
    expect(embeddedImages).toMatchSnapshot('mock-embeddedImages');
  });

  it('should align paragraph correctly', () => {
    const { result } = render(paragraphAlign);
    expect(result).toMatchSnapshot('html');
  });

  it('should align heading correctly', () => {
    const { result } = render(headingAlign);
    expect(result).toMatchSnapshot('html');
  });

  it('should render headings 1-6 correctly', () => {
    const { result } = render(heading);
    expect(result).toMatchSnapshot('html');
  });

  it('should inline text properties correctly', () => {
    const { result } = render(inlineTextProps);
    expect(result).toMatchSnapshot('html');
  });

  it('should inline code properties correctly', () => {
    const { result } = render(inlineCodeProps);
    expect(result).toMatchSnapshot('html');
  });

  it('should render codeblock correctly', () => {
    const { result } = render(codeBlock);
    expect(result).toMatchSnapshot('html');
  });

  it('should render mention correctly', () => {
    const { result } = render(mention);
    expect(result).toMatchSnapshot('html');
  });

  it('should render paragraph with indentations', () => {
    const { result } = render(paragraphIndents);
    expect(result).toMatchSnapshot('html');
  });

  it('should render link', () => {
    const { result } = render(link);
    expect(result).toMatchSnapshot('html');
  });

  it('should render text and does not interpret HTML', () => {
    const { result } = render(text);
    expect(result).toMatchSnapshot('html');
  });

  it('should render status correctly', () => {
    const { result } = render(status);
    expect(result).toMatchSnapshot('html');
  });

  it('should render numbered column for table', () => {
    const { result } = render(tableNumberedColumn);
    expect(result).toMatchSnapshot('html');
  });

  it('should render layout column and sections', () => {
    const { result } = render(layoutColumnSection);
    expect(result).toMatchSnapshot('html');
  });

  it('should render extension placeholders', () => {
    const { result } = render(extensions);
    expect(result).toMatchSnapshot('html');
  });

  it('should render dates in normal text and task lists', () => {
    const { result } = render(date);
    expect(result).toMatchSnapshot('html');
  });

  it('should render lists', () => {
    const { result } = render(lists);
    expect(result).toMatchSnapshot('html');
  });

  it('should render expands', () => {
    const { result } = render(expand);
    expect(result).toMatchSnapshot('html');
  });

  it('should not inline CSS', () => {
    const { result } = render(status, { isInlineCSSEnabled: false });
    expect(result).toMatchSnapshot('html');
  });

  it('should render media based on given context', () => {
    const context: MetaDataContext = {
      hydration: {
        mediaMetaData: {
          'media-type-image': {
            name: 'Dark wallpaper theme.jpg',
            mediaType: 'image',
            mimeType: 'image/jpeg',
            size: 54981,
          },
          'media-type-doc': {
            name: 'My bachelor thesis.pdf',
            mediaType: 'doc',
            mimeType: 'application/pdf',
            size: 12345,
          },
          'media-type-video': {
            name: 'Metallica full concert.mpeg',
            mediaType: 'video',
            mimeType: 'vide/mpeg',
            size: 982347,
          },
          'media-type-audio': {
            name: 'The sound of silence.mp3',
            mediaType: 'audio',
            mimeType: 'audio/mpeg',
            size: 98734,
          },
          'media-type-archive': {
            name: 'The Slackening.zip',
            mediaType: 'archive',
            mimeType: 'application/zip',
            size: 4383,
          },
          'media-type-unknown': {
            name: 'unknown',
            mediaType: 'unknown',
            mimeType: 'unknown',
            size: 54981,
          },
        },
      },
    };
    const { result } = render(mediaGroupAllTypes, undefined, context);
    expect(result).toMatchSnapshot('html');
  });
});
