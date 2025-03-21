import PlayerData from "./PlayerData.model";

interface GameData {
	id: number;
	name: string;
	players: PlayerData[];
}

export default GameData;