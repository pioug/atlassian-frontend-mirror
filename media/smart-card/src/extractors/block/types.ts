export type AlterProps<T> = (props: T, json: any) => T;
export type BuildProps<T> = (json: any) => Partial<T>;
