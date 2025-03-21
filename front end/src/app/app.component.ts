import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import GameData from 'src/models/GameData.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'hop-on';

  steamInfo1: Response | undefined;
  steamInfo2: Response | undefined;

  gamesMap: Map<number, GameData> =  new Map<number, GameData>();

  commonGamesList: Array<string> = [];

	gamesObserver$ = new Subject<GameData>();

	constructor() {
		this.gamesObserver$.subscribe((game: GameData) => {
			const currentGame = this.gamesMap.get(game.id);
			if (currentGame) {
				this.gamesMap.set(game.id, {
					...currentGame,
					players: [...currentGame.players, ...game.players]
				});
			} else {
				fetch(`https://store.steampowered.com/api/appdetails?appids=${game.id}`)
					.then(response => response.json())
					.then(response => {
						this.gamesMap.set(game.id, {
							...game,
							name: response[game.id].data.name
						});
					})
			}
			console.log(this.gamesMap);
		});
	}

	getCommonGames() {
		this.gamesMap.forEach((game) => {
			if (game.players.length > 1) console.log(game)
		});
	}

  ngOnInit() {
    const f1 = fetch(
      'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=3D7BA10165C430E021F14AB172CC5E1E&steamid=76561198089765350&format=json',
			{
				headers: {
					'Access-Control-Allow-Origin': '*',
				},
			}
    )
      .then(response => response.json())
      .then(res => res.response)
      .then(res => {
      this.steamInfo1 = res;
      console.log(res);
      for (const game of res.games) {
				this.gamesObserver$.next({
					id: game.appid,
					name: game.name,
					players: [{id: 76561198089765350, name: 'Arek'}],
				});
      }
    })
    const f2 = fetch(
      'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=3D7BA10165C430E021F14AB172CC5E1E&steamid=76561198297363778&format=json'
    )
      .then(response => response.json())
      .then(res => res.response)
      .then(res => {
        this.steamInfo2 = res;
        console.log(res);
        for (const game of res.games) {
					this.gamesObserver$.next({
						id: game.appid,
						name: game.name,
						players: [{id: 76561198297363778, name: 'Igor'}],
					});
        }
      })
    Promise.all([f1, f2]).then((values) => {
      for (const [id, ppl] of Object.entries(this.gamesMap)) {
        // @ts-ignore
        if (ppl.length > 1) {
          fetch(`https://store.steampowered.com/api/appdetails?appids=${id}`)
            .then(response => {
              console.log(response);
              return response.json();
            })
            .then(res => {
              console.log(res);
              this.commonGamesList.push(res[id].data.name)
            })
        }
      }
    })
  }
}
