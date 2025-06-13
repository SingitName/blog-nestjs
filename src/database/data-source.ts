// src/database/data-source.ts
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource(require('../../ormconfig.json'));
