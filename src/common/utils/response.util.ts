import {
  ApiResponse,
  PaginationMeta,
} from '../interfaces/api-response.interface';

export class ResponseUtil {
  static success<T>(
    message: string,
    data?: T,
    meta?: PaginationMeta,
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      meta,
    };
  }

  static error(message: string, errors?: any): ApiResponse {
    return {
      success: false,
      message,
      errors,
    };
  }
}
