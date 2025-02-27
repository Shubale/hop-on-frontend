import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'hop-on';

  steamInfo1: Response | undefined;
  steamInfo2: Response | undefined;

  gamesMap: any = {};

  commonGamesList: Array<string> = [];

  ngOnInit() {
    const f1 = fetch(
      'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=3D7BA10165C430E021F14AB172CC5E1E&steamid=76561198089765350&format=json'
    )
      .then(response => response.json())
      .then(res => res.response)
      .then(res => {
      this.steamInfo1 = res;
      console.log(res);
      for (const game of res.games) {
        if (!this.gamesMap[game.appid]) this.gamesMap[game.appid] = ['Arek']
        else this.gamesMap[game.appid].push('Arek');
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
          if (!this.gamesMap[game.appid]) this.gamesMap[game.appid] = ['Igor']
          else this.gamesMap[game.appid].push('Igor');
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
