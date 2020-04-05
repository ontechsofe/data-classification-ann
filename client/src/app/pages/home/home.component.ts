import { Component, OnInit } from '@angular/core';
import {ModelSocketService} from "../../services/model-socket.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private modelSocket: ModelSocketService) {
    this.modelSocket.epoch.subscribe(d => console.log(d));
  }

  ngOnInit() {
  }

  train(dataset: string) {
    this.modelSocket.train(dataset, 0.1);
  }

}
