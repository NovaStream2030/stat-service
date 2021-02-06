import * as mongoose from 'mongoose';

export type Stats = Record<string, any>

export interface StatStorage {

    provideStats(uuid: string): Promise<Stats>;

    saveStats(uuid: string, stats: Stats): Promise<void>;

}

export class StatStorageImpl implements StatStorage {

    model = mongoose.model('Stats', new mongoose.Schema({
        uuid: String,
        data: Object
    }));

    constructor(url: string) {
        mongoose.connect(url);
    }

    provideStats(uuid: string): Promise<Stats> {
        return new Promise((resolve, reject) => {
            this.model.find({ uuid: uuid }, (error, stats) => {
                if (error) {
                    console.error(`Unable to load stats for ${uuid}!`, error);
                    reject(error);
                } else {
                    resolve(stats.length == 0 ? {} : stats[0]);
                }
            });
        });
    }

    saveStats(uuid: string, stats: Stats): Promise<void> {
        return new Promise((resolve, reject) => {
            this.model.update(
                { uuid: uuid },
                new this.model({ uuid: uuid, data: stats }),
                { overwrite: true },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                }
            );
        });
    }

}