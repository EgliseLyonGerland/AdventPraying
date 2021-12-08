import { Arguments, Argv, CommandModule } from 'yargs';
import { byId as persons } from '../data/persons';
import draws from '../data/draws';
import { defaultAgeRange, Person } from '../types';
import { exec } from 'child_process';
import terminalSize from 'term-size';
import { ask, confirm } from './utils/prompt';
import { prompt } from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';

type TemplateName = 'end' | 'who';

interface Props {
  template: TemplateName | undefined;
  year: number;
  grouped: boolean;
}

interface Template {
  subject: string;
  body: string;
}

const templates: Record<TemplateName, Template> = {
  end: {
    subject: "C'est fini !",
    body: `
Bonjour %src.firstname%,

Et voilà, l'opération "En Avent la prière !" est à présent terminée ! J'espère que ça aura été pour toi l'occasion d'apprendre à mieux connaitre %dst.firstname% et savoir comment prier pour %dst.pronoun%.

La fin de l'opération marque également la fin du secret (en espérant que celui-ci le soit toujours). C'est donc le moment pour toi de te dévoiler auprès de %dst.firstname% si possible en lui offrant un cadeau d'une valeur symbolique.

Si la personne qui devait prier pour toi ne se manifeste pas, sache que tu recevras dans quelques jours un mail te révélant son nom.

Il ne me reste qu'à te souhaiter un très joyeux Noël.

En Christ,

Nicolas.
`,
  },

  who: {
    subject: 'Qui a prié pour toi ?',
    body: `
Bonjour %src.firstname%,

L'opération "En Avent la prière !" s'est terminée il y a déjà quelques jours et je souhaite te communiquer le nom de la personne qui devait prier pour toi au cas où elle ne se serait pas encore manifestée.

Il s'agit de %dst.firstname% %dst.lastname%.

Je te souhaite une très bonne année %nextYear%.

En Christ,

Nicolas.
`,
  },
};

const command = `mail [template]`;
const describe = 'Prepare mail to send';

function sendMail({
  recipients,
  subject,
  body,
}: {
  recipients: string[];
  subject: string;
  body: string;
}) {
  return new Promise((resolve) => {
    exec(
      'osascript -l JavaScript dist/main.scpt',
      {
        env: {
          sender: 'Nicolas Bazille <nicolas.bazille@egliselyongerland.org>',
          recipients: recipients.join(', '),
          subject,
          body,
        },
      },
      resolve,
    );
  });
}

function builder(yargs: Argv): Argv<Props> {
  return yargs
    .positional('template', {
      desc: 'Define the kind of mail to send',
      type: 'string',
      default: undefined,
      choices: ['end', 'who'],
    })
    .option('year', {
      alias: 'y',
      desc: 'Year',
      type: 'number',
      default: new Date().getFullYear(),
    })
    .option('grouped', {
      desc: 'Send one mail putting addresses in BCC field',
      type: 'boolean',
      default: false,
    });
}

function generate(template: Template, year: number, player: Person): Template {
  const draw = draws[year];
  const dest = persons[draw[player.id]];

  const replace = (text: string) =>
    text
      .replace(/%src.firstname%/g, player.firstname)
      .replace(/%src.lastname%/g, player.lastname)
      .replace(/%src.lastname%/g, player.lastname)
      .replace(/%dst.firstname%/g, dest.firstname)
      .replace(/%dst.lastname%/g, dest.lastname)
      .replace(/%dst.pronoun%/g, dest.gender === 'male' ? 'lui' : 'elle')
      .replace(/%year%/g, String(year))
      .replace(/%nextYear%/g, String(year + 1));

  const subject = replace(template.subject);
  const body = replace(template.body);

  return {
    subject: `${subject} ~~ En Avent la prière ! ~~`,
    body,
  };
}

function isStatic(template: Template) {
  return !/%[\w.]+%/.test(`${template.subject} ${template.body}`);
}

async function handler({ year, template: templateName, grouped }: Arguments<Props>) {
  if (!(year in draws)) {
    throw new Error(`Draw ${year} not found`);
  }

  const { rows } = terminalSize();
  const draw = draws[year];

  const players =
    (await ask<Person[]>({
      type: 'checkbox',
      message: 'Select the recipients',
      choices: Object.keys(draw)
        .map((personId) => persons[personId])
        .map((person) => ({
          value: person,
          name: `${person.firstname} ${person.lastname} (${person.age || defaultAgeRange})`,
          checked: true,
        })),
      pageSize: Math.max(10, rows - 10),
    })) || [];

  if (!players.length) {
    return;
  }

  let template: Template | null = null;
  if (templateName) {
    template = templates[templateName];
  }

  const firstPlayer = players[0];

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (template) {
      let action: string | null = null;

      if (grouped && !isStatic(template)) {
        console.log(
          chalk.redBright(
            "\nVotre message contient des éléments personnalisés ce qui n'est pas possible avec mail groupé.\n",
          ),
        );

        action = await ask({
          type: 'list',
          message: `Que voulez-vous faire ?`,
          choices: [
            {
              name: 'Continuer quand-même',
              value: 'continue',
            },
            {
              name: 'Modifier',
              value: 'edit',
            },
            {
              name: 'Quitter',
              value: 'quit',
            },
          ],
        });
      }

      if (!action || action === 'continue') {
        const example = grouped ? template : generate(template, year, firstPlayer);

        action = await ask({
          type: 'list',
          message: `Voilà à quoi ressemblera le mail qui sera envoyé ${
            grouped ? `à ${firstPlayer.firstname} ${firstPlayer.lastname}` : ''
          }.

${chalk.yellowBright(example.subject)}

${chalk.redBright('~~~~~~~~~~~~~~~~~~~~')}

${chalk.greenBright(example.body)}

Voulez-vous continuer ?
`,
          choices: [
            {
              name: 'Continuer',
              value: 'continue',
            },
            {
              name: 'Modifier',
              value: 'edit',
            },
            {
              name: 'Quitter',
              value: 'quit',
            },
          ],
        });
      }

      if (action === 'quit') {
        process.exit(0);
      }

      if (action === 'continue') {
        break;
      }
    }

    template = await prompt<{
      subject: string;
      body: string;
    }>([
      {
        type: 'input',
        name: 'subject',
        message: 'Sujet',
        default: template?.subject,
      },
      {
        type: 'editor',
        name: 'body',
        message: 'Contenu',
        default: template?.body.trim(),
      },
    ]);
  }

  if (await confirm(`Voulez-vous envoyer un mail de test avant ?`)) {
    const address = await ask<string>({ message: 'Adresse' });
    const example = generate(template, year, firstPlayer);

    const spinner = ora('Envoi').start();
    await sendMail({ recipients: [address || ''], ...example });
    spinner.succeed();
  }

  if (
    !(await confirm(
      `Maintenant êtes-vous prêt à envoyer un mail${grouped ? ' groupé' : ''} à ${
        players.length
      } personne${players.length > 1 ? 's' : ''} ?`,
    ))
  ) {
    return;
  }

  const spinner = ora({ prefixText: 'Envoi' }).start();

  if (grouped) {
    const recipients = players.map((player) => player.email);
    await sendMail({ recipients, ...template });
    spinner.succeed();
  } else {
    let chain = Promise.resolve<unknown>(null);

    players.forEach((player, index) => {
      chain = chain.then(() => {
        const { subject, body } = generate(template as Template, year, player);

        spinner.text = `${index + 1}/${players.length}`;

        return sendMail({
          recipients: [player.email],
          subject,
          body,
        });
      });
    });

    await chain.then(() => {
      spinner.succeed();
    });
  }
}

const commandModule: CommandModule<unknown, Props> = {
  command,
  describe,
  builder,
  handler,
};

export default commandModule;
