export interface PaginationQuery {
  page: number;
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

export interface Paginated<DataType> {
  meta: PaginationMeta;
  items: DataType[];
}
