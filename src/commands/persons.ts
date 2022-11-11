import archiveModule from './persons/archive.js';
import registerModule from './persons/register.js';
import { createModule } from './utils/yargs.js';

const personsCommand = createModule({
  command: 'persons',
  builder: (argv) => argv.command(registerModule).command(archiveModule).demandCommand(),
  handler: () => undefined,
});

export default personsCommand;
