import inquirer, { DistinctQuestion } from 'inquirer';

export async function ask<T>(options: DistinctQuestion) {
  const { answer } = await inquirer.prompt<{
    answer: T;
  }>([{ ...options, name: 'answer' }]);

  return answer || null;
}

export const confirm = (message: string) =>
  ask({
    name: 'continue',
    type: 'confirm',
    message,
  });
