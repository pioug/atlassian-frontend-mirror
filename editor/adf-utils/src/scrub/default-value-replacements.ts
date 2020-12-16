import { hash } from './hash';

export type Value = string | number | boolean | undefined | null;
export type ValueReplacer<V extends Value> = (value: V) => V;

export type ValueReplacements = {
  href: ValueReplacer<string>;
};

export const defaultValueReplacements: ValueReplacements = {
  href: (href: string) =>
    `https://hello.atlassian.net/wiki/spaces/ET/pages/968692273?${hash(href)}`,
};
