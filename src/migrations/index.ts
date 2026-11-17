import * as migration_20261117_175744 from './20261117_175744';
import * as migration_20261118_014500 from './20261118_014500';

export const migrations = [
  {
    up: migration_20261117_175744.up,
    down: migration_20261117_175744.down,
    name: '20261117_175744'
  },
  {
    up:  migration_20261118_014500.up,
    down: migration_20261118_014500.down,
    name: '20261118_014500'
  },
];
