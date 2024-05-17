import Ajv from 'ajv';
import type { Rule } from 'eslint';
import type { FromSchema, JSONSchema } from 'json-schema-to-ts';

import type {
  LintRule as BaseLintRule,
  LintRuleMeta as BaseLintRuleMeta,
} from '@atlaskit/eslint-utils/create-rule';

import { getRuleUrl } from './create-rule';

export interface LintRule<Schema extends JSONSchema, Config>
  extends Omit<BaseLintRule, 'meta' | 'create'> {
  meta: LintRuleMeta<Schema>;

  create(context: Rule.RuleContext, config: Config): Rule.RuleListener;

  /**
   * Unsure why the eslint typings include this when the docs
   * say the schema should be in meta.
   */
  schema?: never;
}

export interface LintRuleMeta<Schema extends JSONSchema>
  extends Omit<BaseLintRuleMeta, 'schema'> {
  schema: Schema;
}

export const createLintRuleWithTypedConfig = <
  Schema extends JSONSchema & { type: 'object' },
  Config = FromSchema<Schema>,
>(
  rule: LintRule<Schema, Config>,
) => {
  /**
   * Gets the default config by running the same validator
   * ESLint does against an empty config object with
   * `useDefaults` option enabled.
   *
   * Any properties with a `default` property set in the schema
   * will be populated with the specified default value.
   */
  function getDefaultConfig(): Config {
    const ajv = new Ajv({ useDefaults: true });
    const validate = ajv.compile(rule.meta.schema);

    const config = {};
    /**
     * The `validate()` function mutates the config object.
     */
    validate(config);

    return config as Config;
  }

  return {
    ...rule,
    meta: {
      ...rule.meta,
      docs: {
        ...rule.meta.docs,
        url: getRuleUrl(rule.meta.name),
      },
      schema: [rule.meta.schema],
    },
    create(context) {
      /**
       * The config the user has passed.
       *
       * If they passed a config object, even if it is missing properties,
       * ESLint will have added any default values defined using the
       * `default` property in the schema.
       *
       * https://github.com/eslint/eslint/pull/11288
       */
      const userConfig = context.options[0] as Config | undefined;
      /**
       * If the user passed no config object at all we need to obtain
       * the default ourselves.
       */
      const config = userConfig ?? getDefaultConfig();

      return rule.create(context, config);
    },
  } as Rule.RuleModule;
};
