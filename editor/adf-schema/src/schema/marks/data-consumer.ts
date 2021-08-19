import { Mark, MarkSpec } from 'prosemirror-model';
import { isDOMElement } from '../../utils/parseDOM';

/**
 * @minLength 1
 */
type DataConsumerSource = string;

export interface DataConsumerAttributes {
  /**
   * @minItems 1
   */
  sources: Array<DataConsumerSource>;
}

/**
 * @name dataConsumer_mark
 * @description This mark is used for metadata surrounding a node consuming data
 * from a given source node
 */
export interface DataConsumerDefinition {
  type: 'dataConsumer';
  attrs: DataConsumerAttributes;
}

export interface DataConsumerMark extends Mark {
  attrs: DataConsumerAttributes;
}

const parseDataConsumer = (maybeValue: string | Node) => {
  const sources =
    isDOMElement(maybeValue) && maybeValue.getAttribute('data-sources');
  try {
    return sources ? { sources: JSON.parse(sources) } : false;
  } catch {
    return false;
  }
};

export const dataConsumer: MarkSpec = {
  attrs: { sources: { default: [] } },
  parseDOM: [
    {
      tag: '[data-mark-type="dataConsumer"]',
      getAttrs: (maybeValue) => parseDataConsumer(maybeValue),
    },
  ],
  toDOM(mark: Mark, inline) {
    const wrapperStyle = inline ? 'span' : 'div';

    return [
      wrapperStyle,
      {
        'data-mark-type': 'dataConsumer',
        'data-sources': JSON.stringify(mark.attrs.sources),
      },
    ];
  },
};

/**
 * We want to ensure any "invalid ADF" doesn't get serialised, but the entire
 * mark itself is not valid without a non-empty `sources`.
 *
 * We _almost could_ simply return `null` if sources length is < 0 & would fit
 * the type signature of prosemirror-model's `fragment` but not `mark`'s toJSON.
 *
 * So we'll leave any extra transformation checks in
 * `editor-json-transformer`(?)
 */
export const toJSON = (mark: Mark) => {
  // // Remove intemediary state if we don't have any sources on data consumer
  // if (mark.attrs?.sources?.length < 1) {
  //   return null;
  // }

  return {
    type: mark.type.name,
    attrs: Object.keys(mark.attrs)
      .filter(
        (key) =>
          key === 'sources' &&
          mark.attrs[key].length > 0 &&
          mark.attrs[key] !== null,
      )
      .reduce<typeof mark.attrs>((acc, key) => {
        acc[key] = mark.attrs[key];
        return acc;
      }, {}),
  };
};
