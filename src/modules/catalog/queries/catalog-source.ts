import  type { CatalogMeta } from "../types";

export abstract class CatalogSource {
  abstract getContentQuery(): string;
  abstract getContributorsQuery(): string;

  protected buildJsonbObject<
    Metadata extends CatalogMeta,
  >(jsonFieldToSqlExpression: Metadata): string {
    const keyValuePairsAsSqlArguments = Object.entries(
      jsonFieldToSqlExpression,
    ).flatMap(([jsonFieldName, sqlExpression]) => {
      const escapedJsonFieldName = jsonFieldName.replace(/'/g, "''");
      return [`'${escapedJsonFieldName}'`, sqlExpression];
    });

    const sqlArgumentList = keyValuePairsAsSqlArguments.join(', ');
    return `json_build_object(${sqlArgumentList})::jsonb`;
  }
}
