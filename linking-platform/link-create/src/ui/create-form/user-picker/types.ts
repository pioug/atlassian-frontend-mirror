import { type Validator } from '../../../common/types';

export type UserPickerProps = {
  /** Name to pass into the <Field>  */
  name: string;

  /** Refers to a product identifier, Jira, Confluence, Townsquare, ect. */
  productKey: string;

  /** Identifier for the product's tenant, also known as tenantId or cloudId */
  siteId: string;

  /** The label text above the component */
  label?: string;

  /** Placeholder text to display in the text field whenever it is empty. */
  placeholder?: string;

  /** Validators for this field */
  validators?: Validator[];

  testId?: string;

  defaultValue: User;
};

type User = {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  email: string;
};
