import {
  ApiResponse,
  PaginationMeta,
} from '../interfaces/api-response.interface';

export class ResponseUtil {
  static success<T>(
    data?: T,
    meta?: PaginationMeta,
  ): ApiResponse<T> {
    return {
      data,
      paging: meta,
    };
  }

  static error(errors?: any): ApiResponse {
    return {
      errors,
    };
  }
}
