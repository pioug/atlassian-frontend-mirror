import { FormApi as FinalFormAPI } from 'final-form';

export type Align = 'start' | 'end';

export type FormApi<FormData> = FinalFormAPI<FormData>;

export type OnSubmitHandler<FormData> = (
  values: FormData,
  form: FormApi<FormData>,
  callback?: (errors?: Record<string, string>) => void,
) => void | Object | Promise<Object | void>;
