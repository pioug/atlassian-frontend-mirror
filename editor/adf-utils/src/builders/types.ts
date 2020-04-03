export type WithMark = {
  type: any;
  marks?: Array<any>;
  [prop: string]: any;
};

export type WithAppliedMark<T, M> = T & { marks?: Array<M> };
