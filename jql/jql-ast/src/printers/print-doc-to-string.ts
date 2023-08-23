import { Doc, Group, IfBreak } from './types';

const computeFlatWidth = (doc: Doc | Doc[]): number => {
  if (typeof doc === 'string') {
    return doc.length;
  }

  if (Array.isArray(doc)) {
    return doc.reduce(
      (result, innerDoc) => result + computeFlatWidth(innerDoc),
      0,
    );
  }

  switch (doc.type) {
    case 'group': {
      return computeFlatWidth(doc.contents);
    }
    case 'if-break': {
      return computeFlatWidth(doc.flatContents);
    }
    case 'new-line': {
      // TODO This probably represents a bug as we don't expect new lines in the flat path
      return 0;
    }
    default:
      throw new Error('Unrecognised doc type.');
  }
};

type PrintContext = {
  printWidth: number | null;
  startIndex: number;
  breakContents: boolean;
};

type PrintOutput = { result: string; endIndex: number };

const printDoc = (doc: Doc, context: PrintContext): PrintOutput => {
  if (typeof doc === 'string') {
    return { result: doc, endIndex: context.startIndex + doc.length };
  }

  switch (doc.type) {
    case 'group': {
      return printGroup(doc, context);
    }
    case 'if-break': {
      return printIfBreak(doc, context);
    }
    case 'new-line': {
      return printNewLine();
    }
    default:
      throw new Error('Unrecognised doc type.');
  }
};

const printGroup = (doc: Group, context: PrintContext): PrintOutput => {
  const docWidth = context.startIndex + computeFlatWidth(doc);
  const breakContents =
    context.printWidth !== null && docWidth > context.printWidth;

  return doc.contents.reduce(
    (agg: PrintOutput, innerDoc) => {
      const innerContext = {
        ...context,
        startIndex: agg.endIndex,
        breakContents,
      };
      const output = printDoc(innerDoc, innerContext);
      return {
        result: agg.result + output.result,
        endIndex: output.endIndex,
      };
    },
    { result: '', endIndex: context.startIndex },
  );
};

const printIfBreak = (doc: IfBreak, context: PrintContext): PrintOutput => {
  if (context.breakContents) {
    return printDoc(doc.breakContents, context);
  }
  return printDoc(doc.flatContents, context);
};

const printNewLine = (): PrintOutput => {
  return {
    result: '\n',
    // Reset our end index as a new line is being output.
    endIndex: 0,
  };
};

export type PrintOptions = {
  /**
   * The max character width of a line of JQL before attempting to break its contents into multiple lines. If `null`
   * then the query will not break.
   */
  printWidth?: number | null;
};

// TODO Tweak this number with design
const defaultPrintWidth = 100;

export const printDocToString = (
  doc: Doc,
  options: PrintOptions = {},
): string => {
  const { printWidth = defaultPrintWidth } = options;
  const output = printDoc(doc, {
    printWidth,
    startIndex: 0,
    breakContents: false,
  });
  return output.result;
};
