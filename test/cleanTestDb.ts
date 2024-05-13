import { rm } from 'fs/promises';
import { join } from 'path';

export const cleanDB = async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (err) {
    // dont care about error, we want to delete anyway
  }
};
