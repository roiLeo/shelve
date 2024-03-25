import type { EnvFile, VariablesCreateInput } from "@shelve/types";
import { $api } from "./connection.ts";
import consola from "consola";
import fs from 'fs';

export function isEnvFileExist() {
  return fs.existsSync('.env');
}

export async function createEnvFile(variables: EnvFile = []) {
  const content = variables.map((item) => `${ item.key }=${ item.value }`).join('\n');
  const finalString = `# Generated by Shelve CLI\n${content}`
  if (isEnvFileExist()) fs.unlinkSync('.env');
  fs.writeFileSync('.env', finalString);
  consola.success('.env file created successfully');
}

export function getEnvFile(): EnvFile {
  const isExist = fs.existsSync('.env');
  if (isExist) {
    const envFile = fs.readFileSync('.env', 'utf8');
    const envFileContent = envFile.split('\n').filter((item) => item && !item.startsWith('#')).join('\n');
    return envFileContent.split('\n').map((item) => {
      const [key, value] = item.split('=');
      return {key, value};
    });
  } else {
    return [];
  }
}

export async function getProjectVariable(projectId: number, environment: string): Promise<EnvFile> {
  consola.start(`Pulling variables for ${environment} environment`);
  try {
    return await $api<EnvFile>(`/variable/${projectId}/${environment}`);
  } catch (error) {
    process.exit(1);
  }
}

export async function pushProjectVariable(projectId: number, environment: string) {
  consola.start(`Pushing variables for ${environment} environment`);
  try {
    const variables = getEnvFile();
    const body: VariablesCreateInput = {
      projectId,
      variables: variables.map((variable) => ({
        key: variable.key,
        value: variable.value,
        projectId,
        environment
      }))
    }
    await $api(`/variable`, {
      method: 'POST',
      body
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
