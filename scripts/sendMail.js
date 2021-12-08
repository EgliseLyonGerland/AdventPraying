const charTable = {
  '√©': 'é',
  '√°': 'á',
  '√≠': 'í',
  '√≥': 'ó',
  '√∂': 'ö',
  '√º': 'ü',
  '√¥': 'ô',
  '√®': 'è',
  '√ß': 'ç',
  '√±': 'ñ',
  '√∏': 'ø',
  '√´': 'ë',
  '√§': 'ä',
  '√•': 'å',
  '√Å': 'Á',
  '√∫': 'ú',
  '√ª': 'û',
  '√Ø': 'ï',
  '√â': 'É',
  '√†': 'à',
  '√¶': 'æ',
  '√Æ': 'î',
  '√¢': 'â',
  '√£': 'ã',
  '√î': 'Ô',
  '√ü': 'ß',
  '√ì': 'Ó',
  '√≤': 'ò',
  '√Ω': 'ý',
  '√ñ': 'Ö',
  '√™': 'ê',
  '√Ä': 'À',
  '√ò': 'Ø',
  '√Ö': 'Å',
  '√∞': 'ð',
  '√á': 'Ç',
  '√Ç': 'Â',
  '√π': 'ù',
  '√í': 'Ò',
  '√¨': 'ì',
  '√ú': 'Ü',
  '√à': 'È',
  '√û': 'Þ',
};

function convert(str) {
  let result = str;

  for (var char in charTable) {
    const exp = new RegExp(char, 'g');
    result = result.replace(exp, charTable[char]);
  }

  return result;
}

const app = Application.currentApplication();
app.includeStandardAdditions = true;

const mail = Application('Mail');

const sender = app.systemAttribute('sender');
const recipients = app.systemAttribute('recipients');
const subject = convert(app.systemAttribute('subject'));
const content = convert(app.systemAttribute('body'));

const msg = mail.OutgoingMessage({ sender, subject, content });

mail.outgoingMessages.push(msg);

const rcpt = mail.Recipient({
  address: recipients,
});

msg.toRecipients.push(rcpt);
msg.send();
