import { BaseQuery } from "src/common/base-qeuery.interface";
import { PaginationResponse } from "src/common/pagination.interface";

export interface IContentService<Entity = any> {
    findAll(query: BaseQuery): Promise<PaginationResponse<Entity>>;
}