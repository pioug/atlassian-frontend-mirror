/** Map of field names to a list of validators for that field */
export type ValidatorMap = Record<string, Validator[]>;

export type Validator = {
  /** Return true when the given input is valid */
  isValid: (val: unknown) => boolean;
  /** An error message is used to tell a user that the field input is invalid. For example, an error message could be 'Invalid username, needs to be more than 4 characters'. */
  errorMessage: string;
};
