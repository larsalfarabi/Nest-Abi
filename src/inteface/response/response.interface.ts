export interface responseSuccess {
  status: string;
  message: string;
  data?: any;
}
export interface responsePagination extends responseSuccess {
  pagination: {
    total: number;
    page: number;
    pageSize: number;
  };
}
