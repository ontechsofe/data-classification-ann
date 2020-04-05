import { Injectable } from '@angular/core';
import {Socket} from "ngx-socket-io";

@Injectable({
  providedIn: 'root'
})
export class ModelSocketService {

  epoch = this.socket.fromEvent<any>('epoch');

  constructor(private socket: Socket) { }

  train(dataset: string, acceptedError: number) {
    const data = {dataset: dataset, acceptedError: acceptedError};
    this.connect();
    this.socket.emit('train', data);
  }

  stop() {
    this.connect();
    this.socket.emit('stop');
  }

  disconnect() {
    this.socket.disconnect();
  }

  private connect() {
    this.socket.connect();
  }
}
