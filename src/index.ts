import chalk from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import drawModule from './commands/draw.js';
import mailModule from './commands/mail.js';
import pdfModule from './commands/pdf.js';
import personsModule from './commands/persons.js';

void yargs(hideBin(process.argv))
  .usage('Usage: $0 <command> [options]')
  .locale('en')
  .command(drawModule)
  .command(pdfModule)
  .command(mailModule)
  .command(personsModule)
  .demandCommand()
  .epilog(`© Église Lyon Gerland ${new Date().getFullYear()}`)
  .fail((msg, err, argv) => {
    console.log(chalk.red(msg));
    console.log();
    console.log(argv.help());
  })
  .parse();
