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
 * @stage 0
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
      getAttrs: maybeValue => parseDataConsumer(maybeValue),
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
