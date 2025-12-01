import { PaginationMeta } from "src/common/pagination.interface";

export function transformToPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
    
    const lastPage = Math.ceil(total / limit);
    const hasNextPage = page < lastPage;
    const hasPrevPage = page > 1;
    
    return {
        total,
        currentPage: page,
        perPage: limit,
        lastPage,
        hasNextPage,
        hasPrevPage,
    }
}