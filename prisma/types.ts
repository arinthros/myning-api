export type Mine = {
  name: string;
  type: 'regular' | 'combat' | 'resource';
  // exp_boost: number;
  // min_player_level: number;
  // cost: number;
  // enemies: Array<number>;
  // characterLevels: Array<number>;
  // max_enemy_items: number;
  // max_item_level: number;
  // max_enemy_item_level: number;
  // odds: Array<Record<'combat' | 'equipment' | 'mineral' | 'recruit' | 'lose_ally', number>>
}

export type Mines = Array<Mine>;