import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AppService {
  private baseUrl: string;

  constructor(private http: Http) {
    this.baseUrl = 'http://jsonplaceholder.typicode.com/';
  }

  /**
   * get different endpoint data base on input parameters
   * @param param [string]
   */
  public getData(param: string) {
    return this.http.get(this.baseUrl + param).pipe(map(res => res.json()));
  }

}
