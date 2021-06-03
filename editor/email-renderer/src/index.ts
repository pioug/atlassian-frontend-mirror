import { defaultSchema } from '@atlaskit/adf-schema';
import { Fragment, Node as PMNode, Schema } from 'prosemirror-model';
import flow from 'lodash/flow';
import property from 'lodash/property';
import {
  SerializeFragmentWithAttachmentsResult,
  SerializerWithImages,
} from './serializer';
import { nodeSerializers } from './node-serializers';
import styles from './styles';
import juice from 'juice';
import { escapeHtmlString } from './escape-html-string';
import { processImages } from './static';
import { createClassName } from './styles/util';
import { fontFamily, fontSize } from './styles/common';
import { MetaDataContext, EmailSerializerOpts } from './interfaces';

const serializeNode = (
  node: PMNode,
  index: number,
  parent?: PMNode,
  serializedHTML?: string,
  context?: MetaDataContext,
): string => {
  // ignore nodes with unknown type
  if (!nodeSerializers[node.type.name]) {
    return `[UNKNOWN_NODE_TYPE: ${node.type.name}]`;
  }

  const parentAttrs = getAttrsFromParent(index, parent);

  return nodeSerializers[node.type.name]({
    node,
    attrs: {
      ...node.attrs,
      ...parentAttrs,
    },
    marks: node.marks,
    parent: parent,
    text:
      serializedHTML || node.attrs.text || node.attrs.shortName || node.text,
    context: context,
  });
};

/**
 * Used to pass attributes that affect nested nodes.
 *
 * Example: A 'table' node contains 'isNumberColumnEnabled' flag. In order to render
 * numbered columns, 'tableRow' node needs to know this information, thus this function.
 *
 * @param parent {PMNode} parent node
 * @param index {number} index of current child in parent's content array
 */
const getAttrsFromParent = (
  index: number,
  parent?: PMNode,
): { [key: string]: any } => {
  if (parent && parent.attrs && parent.attrs.isNumberColumnEnabled) {
    return {
      index: index,
      isNumberColumnEnabled: true,
    };
  }
  return {};
};

const traverseTree = (
  fragment: Fragment,
  parent?: PMNode,
  context?: MetaDataContext,
): any => {
  let output = '';
  fragment.forEach((childNode, _offset, idx) => {
    if (childNode.isLeaf) {
      output += serializeNode(childNode, idx, parent, undefined, context);
    } else {
      const innerHTML = traverseTree(childNode.content, childNode, context);
      output += serializeNode(childNode, idx, parent, innerHTML, context);
    }
  });

  return output;
};

export const commonStyle = {
  'font-family': fontFamily,
  'font-size': fontSize,
  'font-weight': 400,
  'line-height': '24px',
};

const wrapAdf = (content: any[]) => ({ version: 1, type: 'doc', content });

const juicify = (html: string, inlineCSS: boolean): string => {
  const opts: juice.Options = {};
  if (inlineCSS) {
    opts.extraCss = styles;
  }
  return juice(
    `<div class="${createClassName('wrapper')}">${html}</div>`,
    opts,
  );
};

// replace all CID image references with a fake image
const stubImages = (
  content: SerializeFragmentWithAttachmentsResult,
  isMockEnabled: boolean,
) =>
  isMockEnabled
    ? {
        result: content.result!.replace(
          /src="cid:[\w-]*"/gi,
          'src="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="',
        ),
        embeddedImages: content.embeddedImages,
      }
    : content;

/**
 * EmailSerializer allows to disable/mock images via isImageStubEnabled flag.
 * The reason behind this is that in emails, images are embedded separately as inline attachemnts
 * and referenced via CID. However, when rendered in browser, this does not work and breaks the experience
 * when rendered in demo page, so we instead inline the image data.
 */
export class EmailSerializer implements SerializerWithImages<string> {
  readonly opts: EmailSerializerOpts;
  private static readonly defaultOpts: EmailSerializerOpts = {
    isImageStubEnabled: false,
    isInlineCSSEnabled: false,
  };

  constructor(
    private schema: Schema = defaultSchema,
    opts: Partial<EmailSerializerOpts> = {},
  ) {
    this.opts = {
      ...EmailSerializer.defaultOpts,
      ...opts,
    };
  }

  serializeFragmentWithImages = (
    fragment: Fragment,
    context?: MetaDataContext,
  ): SerializeFragmentWithAttachmentsResult => {
    return flow(
      (fragment: Fragment) => fragment.toJSON(),
      JSON.stringify,
      escapeHtmlString,
      JSON.parse,
      wrapAdf,
      this.schema.nodeFromJSON,
      property('content'),
      (fragment) => traverseTree(fragment, undefined, context),
      (html) => juicify(html, this.opts.isInlineCSSEnabled),
      (html) => processImages(html, this.opts.isImageStubEnabled), // inline static assets for demo purposes
      (result) => stubImages(result, this.opts.isImageStubEnabled), // stub user uploaded images to prevent console.errors
    )(fragment);
  };

  serializeFragment: (...args: any) => string = flow(
    this.serializeFragmentWithImages,
    property('result'),
  );

  static fromSchema(
    schema: Schema = defaultSchema,
    opts: Partial<EmailSerializerOpts> = {},
  ): EmailSerializer {
    return new EmailSerializer(schema, opts);
  }
}

export type {
  Attrs,
  EmailSerializerOpts,
  MarkSerializer,
  MarkSerializerOpts,
  MediaMetaDataContextItem,
  MediaType,
  MetaDataContext,
  NodeSerializer,
  NodeSerializerOpts,
  SmartCardWithDataAttributes,
  SmartCardWithUrlAttributes,
  Style,
} from './interfaces';
export {
  CS_CONTENT_PREFIX,
  MEDIA_PREVIEW_IMAGE_HEIGHT,
  MEDIA_PREVIEW_IMAGE_WIDTH,
  createClassName,
} from './styles/util';
export default EmailSerializer;
