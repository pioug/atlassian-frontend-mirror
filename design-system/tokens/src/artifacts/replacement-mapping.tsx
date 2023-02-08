/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * This file is intended to help automate renaming of tokens.
 *
 * 1. Mark the old token's 'state' as deprecated
 * 2. Add a 'replacement' attribute to the token with the value 'my.new.token'
 * 3. Create a new token matching the token above: 'my.new.token'
 * 4. Run 'yarn build tokens' to have you changes reflected in this map
 * 5. ESLint and other tools will now use this to automate replacing tokens
 *
 * These changes will then be picked up by our tooling which will attempt to
 * migrate as many of these renames as possible.
 *
 * @codegen <<SignedSource::6b49e32a168095446e0fc8a0f9b4ca39>>
 * @codegenCommand yarn build tokens
 */
import tokens from './token-names';

type Token = keyof typeof tokens | string;
type RenameMap = {
  path: string;
  state: 'experimental' | 'deprecated' | 'deleted';
  replacement: Token;
}

const replacementMapper: RenameMap[] = [
  {
    "path": "spacing.scaleLinear.0",
    "state": "experimental",
    "replacement": "0"
  },
  {
    "path": "spacing.scaleLinear.100",
    "state": "experimental",
    "replacement": "2px"
  },
  {
    "path": "spacing.scaleLinear.200",
    "state": "experimental",
    "replacement": "4px"
  },
  {
    "path": "spacing.scaleLinear.300",
    "state": "experimental",
    "replacement": "6px"
  },
  {
    "path": "spacing.scaleLinear.400",
    "state": "experimental",
    "replacement": "8px"
  },
  {
    "path": "spacing.scaleLinear.500",
    "state": "experimental",
    "replacement": "12px"
  },
  {
    "path": "spacing.scaleLinear.600",
    "state": "experimental",
    "replacement": "16px"
  },
  {
    "path": "spacing.scaleLinear.700",
    "state": "experimental",
    "replacement": "20px"
  },
  {
    "path": "spacing.scaleLinear.800",
    "state": "experimental",
    "replacement": "24px"
  },
  {
    "path": "spacing.scaleLinear.900",
    "state": "experimental",
    "replacement": "32px"
  },
  {
    "path": "spacing.scaleLinear.1000",
    "state": "experimental",
    "replacement": "40px"
  },
  {
    "path": "spacing.scaleLinear.1100",
    "state": "experimental",
    "replacement": "48px"
  },
  {
    "path": "spacing.size.none",
    "state": "experimental",
    "replacement": "0"
  },
  {
    "path": "spacing.size.xxxxSmall",
    "state": "experimental",
    "replacement": "2px"
  },
  {
    "path": "spacing.size.xxxSmall",
    "state": "experimental",
    "replacement": "4px"
  },
  {
    "path": "spacing.size.xxSmall",
    "state": "experimental",
    "replacement": "6px"
  },
  {
    "path": "spacing.size.xsmall",
    "state": "experimental",
    "replacement": "8px"
  },
  {
    "path": "spacing.size.small",
    "state": "experimental",
    "replacement": "12px"
  },
  {
    "path": "spacing.size.medium",
    "state": "experimental",
    "replacement": "16px"
  },
  {
    "path": "spacing.size.large",
    "state": "experimental",
    "replacement": "20px"
  },
  {
    "path": "spacing.size.xlarge",
    "state": "experimental",
    "replacement": "24px"
  },
  {
    "path": "spacing.size.xxlarge",
    "state": "experimental",
    "replacement": "32px"
  },
  {
    "path": "spacing.size.xxxlarge",
    "state": "experimental",
    "replacement": "40px"
  },
  {
    "path": "spacing.size.xxxxlarge",
    "state": "experimental",
    "replacement": "48px"
  },
  {
    "path": "spacing.gap.100",
    "state": "experimental",
    "replacement": "8px"
  },
  {
    "path": "spacing.gap.200",
    "state": "experimental",
    "replacement": "16px"
  },
  {
    "path": "spacing.gap.300",
    "state": "experimental",
    "replacement": "24px"
  },
  {
    "path": "spacing.inset.100",
    "state": "experimental",
    "replacement": "8px"
  },
  {
    "path": "spacing.inset.200",
    "state": "experimental",
    "replacement": "16px"
  },
  {
    "path": "spacing.inset.300",
    "state": "experimental",
    "replacement": "24px"
  },
  {
    "path": "spacing.ecl.container.12",
    "state": "experimental",
    "replacement": "12px"
  },
  {
    "path": "spacing.ecl.container.16",
    "state": "experimental",
    "replacement": "16px"
  },
  {
    "path": "spacing.ecl.container.20",
    "state": "experimental",
    "replacement": "20px"
  },
  {
    "path": "spacing.ecl.container.24",
    "state": "experimental",
    "replacement": "24px"
  },
  {
    "path": "spacing.ecl.element.2",
    "state": "experimental",
    "replacement": "2px"
  },
  {
    "path": "spacing.ecl.element.4",
    "state": "experimental",
    "replacement": "4px"
  },
  {
    "path": "spacing.ecl.element.6",
    "state": "experimental",
    "replacement": "6px"
  },
  {
    "path": "spacing.ecl.element.8",
    "state": "experimental",
    "replacement": "8px"
  },
  {
    "path": "spacing.ecl.layout.32",
    "state": "experimental",
    "replacement": "32px"
  },
  {
    "path": "spacing.ecl.layout.40",
    "state": "experimental",
    "replacement": "40px"
  },
  {
    "path": "spacing.ecl.layout.64",
    "state": "experimental",
    "replacement": "64px"
  },
  {
    "path": "spacing.ccc.component.2",
    "state": "experimental",
    "replacement": "2px"
  },
  {
    "path": "spacing.ccc.component.4",
    "state": "experimental",
    "replacement": "4px"
  },
  {
    "path": "spacing.ccc.component.6",
    "state": "experimental",
    "replacement": "6px"
  },
  {
    "path": "spacing.ccc.component.8",
    "state": "experimental",
    "replacement": "8px"
  },
  {
    "path": "spacing.ccc.container.32",
    "state": "experimental",
    "replacement": "32px"
  },
  {
    "path": "spacing.ccc.container.40",
    "state": "experimental",
    "replacement": "40px"
  },
  {
    "path": "spacing.ccc.container.48",
    "state": "experimental",
    "replacement": "48px"
  },
  {
    "path": "spacing.ccc.content.12",
    "state": "experimental",
    "replacement": "12px"
  },
  {
    "path": "spacing.ccc.content.16",
    "state": "experimental",
    "replacement": "16px"
  },
  {
    "path": "spacing.ccc.content.20",
    "state": "experimental",
    "replacement": "20px"
  },
  {
    "path": "spacing.ccc.content.24",
    "state": "experimental",
    "replacement": "24px"
  }
];

export default replacementMapper;
