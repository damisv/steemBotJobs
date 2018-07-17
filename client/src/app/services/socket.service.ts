import {Injectable, OnDestroy} from "@angular/core";
import * as io from 'socket.io-client';
import {Observable} from "rxjs/internal/Observable";
import {Log} from "../models";
import {AuthService} from "./auth.service";
import {filter} from "rxjs/operators";

@Injectable()
export class SocketService implements OnDestroy {
  readonly socket;

  constructor(private authService: AuthService) {
    this.socket = io();
    // Login listeners
    this.socket.on('connected', () => this.initRegister());
  }

  // EMITTERS
  private initRegister() {
    this.authService.$loggedAccount
      .pipe(filter((acc) => acc !== null))
      .subscribe((acc) => this.socket.emit('online', acc.user));
  }

  // Listeners

  // RX LISTENERS
  onLogReceived(): Observable<{id: any, log: Log}> {
    return new Observable<{id: any, log: Log}>(observer => {
      this.socket.on('logs', (log, jobID) => {
        console.log(log);
        observer.next({id: jobID, log: log})
      });
    });
  }

  ngOnDestroy() { if (this.socket) { this.socket.close(); } }
}
