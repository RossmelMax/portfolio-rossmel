import { Component, OnInit } from '@angular/core';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faSitemap } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-proyects',
  templateUrl: './proyects.component.html',
  styleUrls: ['./proyects.component.scss']
})
export class ProyectsComponent implements OnInit {
  faCalculator = faCalculator;
  faClock = faClock;
  faSiteMap = faSitemap;
  faUser = faUser;
  constructor() { }

  ngOnInit(): void {
  }

}
