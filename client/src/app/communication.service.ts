import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// tslint:disable-next-line:ordered-imports
import { of, Observable, Subject } from "rxjs";
import { catchError } from "rxjs/operators";
import { EspeceOiseau } from '../../../common/tables/EspeceOiseau';

@Injectable()
export class CommunicationService {
  private readonly BASE_URL: string = "http://localhost:3000/database";
  public constructor(private http: HttpClient) {}

  private _listners: any = new Subject<any>();

  public listen(): Observable<any> {
    return this._listners.asObservable();
  }

  public filter(filterBy: string): void {
    this._listners.next(filterBy);
  }

  public getEspeces(): Observable<EspeceOiseau[]> {
    return this.http
      .get<EspeceOiseau[]>(this.BASE_URL + "/especeoiseau")
      .pipe(catchError(this.handleError<EspeceOiseau[]>("getEspeces")));
  }

  public insertEspece(espece: EspeceOiseau): Observable<number> {
    return this.http
      .post<number>(this.BASE_URL + "/especeoiseau/insert", espece)
      .pipe(catchError(this.handleError<number>("insertEspece")));
  }

  public updateEspece(espece: EspeceOiseau): Observable<number> {
    return this.http
      .put<number>(this.BASE_URL + "/especeoiseau/update", espece)
      .pipe(catchError(this.handleError<number>("updateOiseau")));
  }

  public deleteEspece(nomscientifique: string): Observable<number> {
    return this.http
      .post<number>(this.BASE_URL + "/especeoiseau/delete/" + nomscientifique, {})
      .pipe(catchError(this.handleError<number>("deleteOiseau")));
  }

  private handleError<T>(
    request: string,
    result?: T
  ): (error: Error) => Observable<T> {
    return (error: Error): Observable<T> => {
      return of(result as T);
    };
  }
}
