export interface Pagination {
  page: number;
  limit: number;
  skip: number;
}

export function getPagination(page: number, limit: number): Pagination {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(Math.floor(limit), 100) : 20;
  return { page: safePage, limit: safeLimit, skip: (safePage - 1) * safeLimit };
}
