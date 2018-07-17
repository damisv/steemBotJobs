import {Injectable} from "@angular/core";
import {Account, Log} from "../models";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {HttpClient} from "@angular/common/http";
import {SocketService} from "./socket.service";
import {AuthService} from "./auth.service";
import {filter} from "rxjs/operators";

@Injectable()
export class LogsService {
  static base = 'api/logs';

  private _logs = new BehaviorSubject<{[key: string]: Log[]}>({});
  set logs(val: {[key: string]: Log[]}) { this._logs.next(val); }
  get logs() { return this._logs.value; }

  public $logs = this._logs.asObservable();

  constructor(private http: HttpClient,
              private socketService: SocketService,
              private authService: AuthService) {
    this.authService.$loggedAccount.pipe(filter( acc => acc !== null))
          .subscribe( (acc) => this.getLogs(acc));
    socketService.onLogReceived().subscribe((val) => {
      const temp = this.logs;
      temp[val.id].push(val.log);
      this.logs = temp;
    });
  }

  private getLogs(acc: Account) {
    this.http.post<{[key: string]: Log[]}>(LogsService.base, {acc: acc})
      .subscribe((val) => this.logs = val);
  }
}
