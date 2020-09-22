export interface ADFEntityMark {
  type: string;
  attrs?: { [name: string]: any };
}

export interface ADFEntity {
  type: string;
  attrs?: { [name: string]: any };
  content?: Array<ADFEntity | undefined>;
  marks?: Array<ADFEntityMark>;
  text?: string;
  [key: string]: any;
}

export type Visitor = (
  node: ADFEntity,
  parent: EntityParent,
  index: number,
  depth: number,
) => ADFEntity | false | undefined | void;

export type VisitorCollection = { [nodeType: string]: Visitor };

export type EntityParent = { node?: ADFEntity; parent?: EntityParent };
