/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - CheckboxGroupProps
 *
 * @codegen <<SignedSource::a1d69094fb2df291d7091bf99ee72993>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/checkboxgroup/index.tsx <<SignedSource::a209d8dcdd1d500b0c7d52145ad41040>>
 */
export interface CheckboxGroupProps {
  name: string;
  options: { label: string; value: string; isDisabled?: boolean }[];
  value?: string[];
  onChange?: (values: string[]) => void;
  defaultValue?: string[];
  isDisabled?: boolean;
}