import {
  API,
  ASTPath,
  FileInfo,
  ImportDeclaration,
  ImportSpecifier,
  Options,
} from 'jscodeshift';

import { addCommentBefore } from './utils';

const replacementMapping: { [name: string]: string } = {
  JiraCoreIcon: 'JiraWorkManagementIcon',
  JiraCoreLogo: 'JiraWorkManagementLogo',
  JiraCoreWordmark: 'JiraWorkManagementWordmark',
  JiraServiceDeskIcon: 'JiraServiceManagementIcon',
  JiraServiceDeskLogo: 'JiraServiceManagementLogo',
  JiraServiceDeskWordmark: 'JiraServiceManagementWordmark',
  OpsGenieIcon: 'OpsgenieIcon',
  OpsGenieIconLogo: 'OpsgenieIconLogo',
  OpsGenieIconWordmark: 'OpsgenieIconWordmark',
  StrideIcon: 'NO_ALTERNATIVE_COMPONENT',
  StrideLogo: 'NO_ALTERNATIVE_COMPONENT',
  StrideWordmark: 'NO_ALTERNATIVE_COMPONENT',
  HipchatIcon: 'NO_ALTERNATIVE_COMPONENT',
  HipchatLogo: 'NO_ALTERNATIVE_COMPONENT',
  HipchatWordmark: 'NO_ALTERNATIVE_COMPONENT',
};

export default function transform(
  file: FileInfo,
  { jscodeshift: j }: API,
  options: Options,
) {
  const source = j(file.source);
  const target = source
    .find(j.ImportDeclaration)
    .filter(
      (path: ASTPath<ImportDeclaration>) =>
        path.node.source.value === '@atlaskit/logo',
    );
  const logoImports = target.find(j.ImportSpecifier);

  if (!logoImports.length) {
    // Returns original source file, untouched and unformatted
    return file.source;
  }

  logoImports.forEach((path: ASTPath<ImportSpecifier>) => {
    const foundKey = Object.keys(replacementMapping).find(
      (key) => key === path.node.imported.name,
    );

    if (!foundKey || !replacementMapping[foundKey] || !path.node.local) {
      return;
    }
    // add comment for logo component that don't have alternatives
    if (replacementMapping[foundKey] === 'NO_ALTERNATIVE_COMPONENT') {
      addCommentBefore(
        j,
        target,
        `This file uses the @atlaskit/logo \`${foundKey}\` 
        has now been removed with no alternative.`,
      );
      return;
    }

    // replace the import with mapping name
    const newLogoImport: ImportSpecifier = j.importSpecifier(
      j.identifier(replacementMapping[foundKey]),
      // if aliased import exist, keep the alias name unchanged, i.e.
      // before: import { JiraCoreLogo as JCLogo } from '@atlaskit/logo';
      // after: import { JiraWorkManagementLogo as JCLogo } from '@atlaskit/logo';
      // otherwise alias the import using the original name, i.e.
      // before: import { JiraCoreLogo } from '@atlaskit/logo';
      // after: import { JiraWorkManagementLogo as JiraCoreLogo } from '@atlaskit/logo';
      j.identifier(
        path.node.local.name !== path.node.imported.name
          ? path.node.local.name
          : foundKey,
      ),
    );

    j(path).replaceWith(newLogoImport);
  });

  return source.toSource(options.printOptions);
}
