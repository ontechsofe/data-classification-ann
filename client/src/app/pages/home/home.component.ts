import {Component, OnInit} from '@angular/core';
import {ModelSocketService} from "../../services/model-socket.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  reset = false;

  constructor(private modelSocket: ModelSocketService) {
  }

  ngOnInit() {
  }

  train(dataset: string) {
    this.reset = !this.reset;
    this.stop();
    this.modelSocket.train(dataset, 0.1);
  }

  stop() {
    this.modelSocket.disconnect();
  }

}
