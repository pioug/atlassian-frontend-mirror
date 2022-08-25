import * as ts from 'typescript';

import { EventSpec, AnalyticsSpec } from './types';

import { getAttributePropertySignature } from './attribute';
import { generateContextDataTypeAliases } from './context';

const getEventKey = ({
  type,
  action,
  actionSubject,
  actionSubjectId,
}: EventSpec) => {
  return ([type, actionSubject, action, actionSubjectId].filter(
    Boolean,
  ) as string[]).join('.');
};

const getEventPayloadTypeName = ({
  action,
  actionSubject,
  actionSubjectId,
}: EventSpec) => {
  return (
    ([actionSubject, action, actionSubjectId].filter(Boolean) as string[])
      .map(x => {
        return x.slice(0, 1).toUpperCase() + x.slice(1);
      })
      .join('') + 'AttributesType'
  );
};

export const generateSource = (spec: AnalyticsSpec): string => {
  const file = ts.createSourceFile(
    'source.ts',
    '',
    ts.ScriptTarget.ESNext,
    false,
    ts.ScriptKind.TS,
  );

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  const events = spec.events.map(event => {
    const typeAliasDeclaration = ts.factory.createTypeAliasDeclaration(
      undefined,
      [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
      getEventPayloadTypeName(event),
      undefined,
      ts.factory.createTypeLiteralNode(
        event.attributes
          ? Object.entries(event.attributes)
              // Filter out attributes that are provided via context
              // For our purposes here we are only interested in the attributes
              // directly provided via payload
              .filter(([_, attributeSpec]) => !attributeSpec.context)
              .map(getAttributePropertySignature)
          : [],
      ),
    );

    return {
      eventKey: getEventKey(event),
      typeAliasDeclaration,
    };
  });

  const identifier = ts.factory.createIdentifier('AnalyticsEventAttributes');

  const analyticsEventAttributes = ts.factory.createTypeAliasDeclaration(
    undefined,
    undefined,
    identifier,
    undefined,
    ts.factory.createTypeLiteralNode(
      events.map(({ eventKey, typeAliasDeclaration }) => {
        return ts.factory.createPropertySignature(
          undefined,
          ts.factory.createIdentifier(`'${eventKey}'`),
          undefined,
          ts.factory.createTypeReferenceNode(typeAliasDeclaration.name),
        );
      }),
    ),
  );

  const createEventPayloadIdentifier = ts.factory.createIdentifier(
    'createEventPayload',
  );

  const eventKeyIdentifier = ts.factory.createIdentifier('eventKey');
  const attributesIdentifier = ts.factory.createIdentifier('attributes');

  const createEventPayloadDeclaration = ts.factory.createFunctionDeclaration(
    undefined,
    undefined,
    undefined,
    createEventPayloadIdentifier,
    [
      ts.factory.createTypeParameterDeclaration(
        'K',
        ts.factory.createTypeOperatorNode(
          ts.SyntaxKind.KeyOfKeyword,
          ts.factory.createTypeReferenceNode(identifier),
        ),
      ),
    ],
    [
      ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        eventKeyIdentifier,
        undefined,
        ts.factory.createTypeReferenceNode('K'),
      ),
      ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        attributesIdentifier,
        undefined,
        ts.factory.createIndexedAccessTypeNode(
          ts.factory.createTypeReferenceNode(identifier),
          ts.factory.createTypeReferenceNode('K'),
        ),
      ),
    ],
    undefined,
    ts.factory.createBlock([
      ts.factory.createVariableStatement(
        [],
        ts.factory.createVariableDeclarationList(
          [
            ts.factory.createVariableDeclaration(
              'event',
              undefined,
              undefined,
              ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(
                  eventKeyIdentifier,
                  'split',
                ),
                undefined,
                [ts.factory.createStringLiteral('.')],
              ),
            ),
          ],
          ts.NodeFlags.Const,
        ),
      ),
      ts.factory.createReturnStatement(
        ts.factory.createObjectLiteralExpression([
          ts.factory.createPropertyAssignment(
            'eventType',
            ts.factory.createElementAccessExpression(
              ts.factory.createIdentifier('event'),
              0,
            ),
          ),
          ts.factory.createPropertyAssignment(
            'actionSubject',
            ts.factory.createElementAccessExpression(
              ts.factory.createIdentifier('event'),
              1,
            ),
          ),
          ts.factory.createPropertyAssignment(
            'action',
            ts.factory.createElementAccessExpression(
              ts.factory.createIdentifier('event'),
              2,
            ),
          ),
          ts.factory.createPropertyAssignment(
            'actionSubjectId',
            ts.factory.createElementAccessExpression(
              ts.factory.createIdentifier('event'),
              3,
            ),
          ),
          ts.factory.createPropertyAssignment(
            attributesIdentifier,
            attributesIdentifier,
          ),
        ]),
      ),
    ]),
  );

  return [
    // Context Type Aliases
    ...generateContextDataTypeAliases(spec),
    // Event Attribute Aliases
    ...events.map(({ typeAliasDeclaration }) => typeAliasDeclaration),
    // Analytics Events Attributes Map
    analyticsEventAttributes,
    // Util createEventPayload fn
    createEventPayloadDeclaration,
    // Default export
    ts.factory.createExportDefault(createEventPayloadIdentifier),
  ]
    .map(node => printer.printNode(ts.EmitHint.Unspecified, node, file))
    .join('\n');
};
