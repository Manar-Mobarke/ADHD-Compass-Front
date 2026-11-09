import { Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { Audience } from '../../components/audience/audience';
import { Services } from '../../components/services/services';
import { Community } from '../../components/community/community';
import { Screening } from '../../components/screening/screening';
import { UserJourney } from '../../components/user-journey/user-journey';
import { Values } from '../../components/values/values';
import { Articles } from '../../components/articles/articles';
import { Specialists } from '../../components/specialists/specialists';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-home',
  imports: [Hero, Audience, Services, Community, Screening, UserJourney, Values, Articles, Specialists, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
