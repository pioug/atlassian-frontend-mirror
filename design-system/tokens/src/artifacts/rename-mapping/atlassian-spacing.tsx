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
 * @codegen <<SignedSource::96a569b32686a2088f106c2ec4cd75d3>>
 * @codegenCommand yarn build tokens
 */
import tokens from '../token-names';

type Token = keyof typeof tokens | string;
type RenameMap = {
  path: string;
  state: 'experimental' | 'deprecated' | 'deleted';
  replacement: Token;
}

const renameMapper: RenameMap[] = [
  {
    "path": "spacing.container.gutter",
    "state": "experimental",
    "replacement": "8px"
  },
  {
    "path": "spacing.scale.0",
    "state": "experimental",
    "replacement": "0"
  },
  {
    "path": "spacing.scale.100",
    "state": "experimental",
    "replacement": "8px"
  },
  {
    "path": "spacing.scale.150",
    "state": "experimental",
    "replacement": "12px"
  },
  {
    "path": "spacing.scale.200",
    "state": "experimental",
    "replacement": "16px"
  },
  {
    "path": "spacing.scale.250",
    "state": "experimental",
    "replacement": "20px"
  },
  {
    "path": "spacing.scale.300",
    "state": "experimental",
    "replacement": "24px"
  },
  {
    "path": "spacing.scale.400",
    "state": "experimental",
    "replacement": "32px"
  },
  {
    "path": "spacing.scale.500",
    "state": "experimental",
    "replacement": "40px"
  },
  {
    "path": "spacing.scale.600",
    "state": "experimental",
    "replacement": "48px"
  },
  {
    "path": "spacing.scale.025",
    "state": "experimental",
    "replacement": "2px"
  },
  {
    "path": "spacing.scale.050",
    "state": "experimental",
    "replacement": "4px"
  },
  {
    "path": "spacing.scale.075",
    "state": "experimental",
    "replacement": "6px"
  }
];

export default renameMapper;
