import { AxiosResponse } from 'axios';
import AbstractApi from './AbstractApi';

export default class AccountApi extends AbstractApi {  
  // getAccountInfo = async (): Promise<any> =>
  //   this.client.post(`/api/account/getAllInfo`, {intUAL: localStorage.getItem('UAL'),}).then((res) => res.data);

  getAccountInfo = async (): Promise<any> =>
    this.client.post(`/api/account/getAllInfo`, {intUAL: localStorage.getItem('UAL'),}).then((res) => JSON.parse(res.data));

  saveUser = async (params: JSON): Promise<any> =>
    this.client.post(`/api/account/SaveUser`, params).then((res) => res.data);
  
  // addNewUser = async (data: any): Promise<any> =>
  //   this.client.post(`/api/account/addNewUser`, data).then((res) => res.data);
    
  // updateProfile = async (data: any): Promise<any> =>
  //   this.client.post(`/api/account/updateProfile`, data).then((res) => res.data);

  updateProfile = async (params: JSON): Promise<any> =>
    this.client.post(`/api/account/SaveUser`, params).then((res) => res.data);

  // updateUser = async (data: any): Promise<any> =>
  //   this.client.post(`/api/account/updateUser`, data).then((res) => res.data);


  removeUser = async (data: any): Promise<any> =>
    this.client.post(`/api/account/deleteUser`, data).then((res) => res.data);

  updatePassword = async (data: any): Promise<any> =>
    this.client.post(`/api/user/updatePassword`, data).then((res) => res.data);

  getUsersByCustomer = async (data: any): Promise<any> =>
    this.client.post(`/api/account/GetUsersByCustomer`, data).then((res) => JSON.parse(res.data));

  getUser = async (data: any): Promise<any> =>
    this.client.post(`/api/account/GetUser`, data).then((res: any) => JSON.parse(res.data));

  getUsers = async (data: any): Promise<any> =>
    this.client.post(`/api/account/GetUsers`, data).then((res: any) => JSON.parse(res.data));

  // addNewCustomer = async (data: any): Promise<any> =>
  //   this.client.post(`/api/account/addNewCustomer`, data).then((res) => res.data);

  updateCustomer = async (data: any): Promise<any> =>
    this.client.post(`/api/account/updateCustomer`, data).then((res) => res.data);

  saveCustomer = (params: JSON): Promise<any> =>
    this.client.post(`/api/account/SaveCustomer`, params).then((res: any) => res.data);


  removeCustomer = async (data: any): Promise<any> =>
    this.client.post(`/api/account/deleteCustomer`, data).then((res) => res.data);
}
