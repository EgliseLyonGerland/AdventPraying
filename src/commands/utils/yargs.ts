import { CommandModule } from 'yargs';

export function createModule<T, U>(module: CommandModule<T, U>) {
  return module;
}
