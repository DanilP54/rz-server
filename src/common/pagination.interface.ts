export interface PaginationQuery {
  offset: number;
  limit: number;
}

export interface PaginationMeta {
  currentPage: number;
  perPage: number;
  total: number;
  lastPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginationResponse<DataType> {
  meta: PaginationMeta;
  items: DataType[];
}
