export interface RequestParams<T = any> {
  url: string;
  method?: string;
  expire?: number;
  data?: T;
  header?: T;
  isFormData?: boolean;
}

export interface ResponseData<T = any> {
	code: string;
	msg: string;
	data?: T;
}