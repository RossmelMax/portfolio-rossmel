import { Component, OnInit } from '@angular/core';
import { faHtml5 } from '@fortawesome/free-brands-svg-icons';
import { faSass } from '@fortawesome/free-brands-svg-icons';
import { faJs } from '@fortawesome/free-brands-svg-icons';
import { faAngular } from '@fortawesome/free-brands-svg-icons'; 
import { faLinux } from '@fortawesome/free-brands-svg-icons';
import { faWindows } from '@fortawesome/free-brands-svg-icons';
import { faGit } from '@fortawesome/free-brands-svg-icons';
import { faFlagUsa } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {

  faHtml5 = faHtml5;
  faSass = faSass;
  faJs = faJs;
  faAngular = faAngular;
  faLinux = faLinux;
  faWindows = faWindows;
  faGit = faGit
  faFlagUsa = faFlagUsa

  constructor() { }

  ngOnInit(): void {
  }

}
