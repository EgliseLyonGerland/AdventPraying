import archiveCommand from './persons/archive.js';
import { createModule } from './utils/yargs.js';

const personsCommand = createModule({
  command: 'persons',
  builder: (argv) => argv.command(archiveCommand).demandCommand(),
  handler: () => undefined,
});

export default personsCommand;
