import { responsePagination } from 'src/inteface/response';

class BaseResponse {
  _success(message: string, data?: any) {
    return {
      status: 'Success',
      message: message,
      data: data || {},
    };
  }
  _pagination(
    message: string,
    data: any,
    totalData: number,
    page: number,
    pageSize: number,
  ): responsePagination {
    return {
      status: 'Success',
      message: message,
      data: data,
      pagination: {
        total: totalData,
        page: page,
        pageSize: pageSize,
      },
    };
  }
}

export default BaseResponse;
