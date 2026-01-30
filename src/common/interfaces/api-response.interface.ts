export interface ApiResponse<T = any> {
  data?: T;
  errors?: any;
  paging?: PaginationMeta;
}

export interface PaginationMeta {
  current: number;
  size: number;
  total: number;
}
