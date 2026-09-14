export const hasValue = (value?: string): value is string => !!value && value.trim().length > 0;
