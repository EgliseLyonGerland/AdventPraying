import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import drawCommand from './commands/draw';
import registerCommand from './commands/register';
import pdfCommand from './commands/pdf';

void yargs(hideBin(process.argv))
  .usage('Usage: $0 <command> [options]')
  .locale('en')
  .command(drawCommand)
  .command(registerCommand)
  .command(pdfCommand)
  .demandCommand()
  .epilog(`© Église Lyon Gerland ${new Date().getFullYear()}`)
  .wrap(Math.min(100, yargs.terminalWidth()))
  .help()
  .parse();
