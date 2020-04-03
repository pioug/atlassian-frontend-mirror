export interface ADFEntityMark {
  type: string;
  attrs?: { [name: string]: any };
}

export interface ADFEntity {
  type: string;
  attrs?: { [name: string]: any };
  content?: Array<ADFEntity>;
  marks?: Array<ADFEntityMark>;
  text?: string;
  [key: string]: any;
}
