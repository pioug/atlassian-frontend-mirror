import { nextMajorVersion } from '../version-wrapper';

export interface DeprecationWarning {
  property: string;
  description?: string;
  type?: string;
  condition?: (props: any) => boolean;
}

const deprecationWarnings = (
  className: string,
  props: any,
  deprecations: Array<DeprecationWarning>,
): void => {
  const nextVersion = nextMajorVersion();
  for (const deprecation of deprecations) {
    const {
      property,
      type = 'enabled by default',
      description = '',
      condition = () => true,
    } = deprecation;

    if (props.hasOwnProperty(property)) {
      if (condition(props)) {
        // eslint-disable-next-line no-console
        console.warn(
          `${property} property for ${className} is deprecated. ${description} [Will be ${type} in editor-core@${nextVersion}]`,
        );
      }
    }
  }
};

export default deprecationWarnings;
