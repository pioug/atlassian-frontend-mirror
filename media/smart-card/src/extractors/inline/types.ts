export type AlterInlineProps<T> = (props: T, json: any) => T;
export type BuildInlineProps<T> = (json: any) => Partial<T>;
