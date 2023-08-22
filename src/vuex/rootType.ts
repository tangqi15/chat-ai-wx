export interface RootState {
  user?: any;
  systemInfo: any;
}

export type City = {
  cityId: string;
  cityName: string;
};

export type Enums = {
  code: number;
  desc: string;
};
export interface CommonState {
  userState: object;
}
