import {
  Node,
  Type,
  Symbol,
  TypeFlags,
  UnionType,
  TupleType,
  SourceFile,
  SyntaxKind,
  ObjectType,
  Declaration,
  LiteralType,
  TypeChecker,
  ObjectFlags,
  JSDocTagInfo,
  TypeReference,
  IntersectionType,
  InterfaceDeclaration,
  TypeAliasDeclaration,
} from 'typescript';

export type TagInfo = {
  name?: string;
  stage?: number;
  allowUnsupportedBlock?: boolean;
  allowUnsupportedInline?: boolean;
  [key: string]: any;
};

export type PrimitiveType = number | boolean | string;

export function getTags(tagInfo: JSDocTagInfo[]): TagInfo {
  return tagInfo.reduce((obj, { name, text }) => {
    if (!text || !text.length) {
      return obj;
    }
    let val: string = text.map((text) => text.text).join('');
    if (/^\d+$/.test(val)) {
      // Number
      obj[name] = +val;
    } else if (val === 'true') {
      obj[name] = true;
    } else if (val === 'false') {
      obj[name] = false;
    } else if (val[0] === '"') {
      // " wrapped string
      obj[name] = JSON.parse(val);
    } else if (typeof val === 'string') {
      obj[name] = val;
    }
    return obj;
  }, {} as TagInfo);
}

export function extractLiteralValue(type: LiteralType): PrimitiveType {
  if (type.flags & TypeFlags.EnumLiteral) {
    let str = String(type.value);
    let num = parseFloat(str);
    return isNaN(num) ? str : num;
  } else if (type.isStringLiteral() || type.isNumberLiteral()) {
    return type.value;
  } else if (type.flags & TypeFlags.BooleanLiteral) {
    return (type as any).intrinsicName === 'true';
  }
  throw new Error(`Couldn't parse in extractLiteralValue`);
}

export function getTypeFromSymbol(checker: TypeChecker, symbol: Symbol) {
  return checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!);
}

export function isSourceFile(node: Node): node is SourceFile {
  return node.kind === SyntaxKind.SourceFile;
}

export function isInterfaceDeclaration(
  node: Node,
): node is InterfaceDeclaration {
  return node.kind === SyntaxKind.InterfaceDeclaration;
}

export function isTypeAliasDeclaration(
  node: Node | Declaration,
): node is TypeAliasDeclaration {
  return node.kind === SyntaxKind.TypeAliasDeclaration;
}

/* eslint-disable no-bitwise */
export function isStringType(type: Type) {
  return (type.flags & TypeFlags.String) > 0;
}

export function isBooleanType(type: Type) {
  return (type.flags & TypeFlags.Boolean) > 0;
}

export function isNumberType(type: Type) {
  return (type.flags & TypeFlags.Number) > 0;
}

export function isUnionType(type: Type): type is UnionType {
  return (type.flags & TypeFlags.Union) > 0;
}

export function isIntersectionType(type: Type): type is IntersectionType {
  return (type.flags & TypeFlags.Intersection) > 0;
}

export function isArrayLikeType(type: Type): type is TypeReference {
  /**
   * Here instead of checking `type.getSymbol().getName() === 'Array'`
   * we are checking `length`.
   * @see https://blogs.msdn.microsoft.com/typescript/2018/01/17/announcing-typescript-2-7-rc/#fixed-length-tuples
   */
  return (
    isObjectType(type) &&
    (type.objectFlags & ObjectFlags.Reference) > 0 &&
    !!type.getProperty('length')
  );
}

export function isTupleType(type: Type): type is TupleType {
  return isObjectType(type) && (type.objectFlags & ObjectFlags.Tuple) > 0;
}

export function isObjectType(type: Type): type is ObjectType {
  return (type.flags & TypeFlags.Object) > 0;
}

export function isNonPrimitiveType(type: Type): type is LiteralType {
  return (type.flags & TypeFlags.NonPrimitive) > 0;
}

export function isAnyType(type: Type): type is Type {
  return (type.flags & TypeFlags.Any) > 0;
}
/* eslint-enable no-bitwise */

export function syntaxKindToName(kind: SyntaxKind) {
  return SyntaxKind[kind];
}

export function getPmName(name: string) {
  return (
    name
      .replace(/_node|_mark$/, '')
      // @see https://product-fabric.atlassian.net/wiki/spaces/E/pages/722076396/ADF+Change+22+Consistent+naming
      .replace('table_row', 'tableRow')
      .replace('table_header', 'tableHeader')
      .replace('table_cell', 'tableCell')
  );
}

export function isObject(value: any) {
  return value !== null && typeof value === 'object';
}

export function isDefined<T>(value: T): value is NonNullable<T> {
  return value != null;
}
