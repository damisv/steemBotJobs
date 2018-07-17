import logger from "../util/logger";

const steem = require('steem');
import {ioServer} from '../../index';
import DBClient from '../../src/database/dbClient';
import {ObjectID} from "bson";

export class SteemController {
    readonly user: string;
    readonly key: string;
    readonly jobName: string;
    readonly jobID: ObjectID;

    constructor(attrs: any) {
        this.user = attrs.data.username;
        this.key = attrs.data.key;
        this.jobName = attrs.data.jobName;
        this.jobID = attrs._id;
    }

    private async sendLog(type: string, message: string) {
        const log = {type: 'log', date: new Date().toLocaleString(), message: message};
        await DBClient.update({_id: this.jobID}, {$push: {logs: log}}, 'logs');
        ioServer.sendLog(this.user, log, this.jobID);
    }

    public async start() {
        steem.api.setOptions({ url: 'https://api.steemit.com' });
        const exists = await DBClient.findOne({_id: this.jobID}, 'logs');
        if (exists === null) {
            await DBClient.insertOne({_id: this.jobID, logs: []}, 'logs');
        }
        try {
            const count: {[key: string]: any} = await this.getCount();
            const followers = await this.getFollowers(count['follower_count']);
            const following = await this.getFollowing(count['following_count']);
            let temp = await this.getUsersToBeFollowed(followers, following, this.user);
            if (temp.length > 0) {
                await this.sendLog('log', `SHOULD FOLLOW --> ${temp.length} users`);
                this.follow(temp);
            } else {
                await this.sendLog('log', `${this.user} FOLLOWS EVERY FOLLOWER ALREADY`);
            }
        } catch (error) {
            await this.sendLog('error', error);
        }
    }

    private getCount() {
        return new Promise((resolve, reject) => {
           steem.api.getFollowCount(this.user, (err: any, result: any) => err ? reject(err): resolve(result));
        });
    }

    private getFollowers(count: number) {
        return new Promise((resolve, reject) => {
            steem.api.getFollowers(this.user, 0, 'blog', count,
                (err: any, result: any) => err ? reject(err): resolve(result));
        })
    }

    private getFollowing(count: number) {
        return new Promise((resolve, reject) => {
            steem.api.getFollowing(this.user, 0, 'blog', count,
                (err: any, result: any) => err ? reject(err): resolve(result));
        })
    }

    private follow(willFollow: any[], idx = 0){
        if (idx < willFollow.length) {
            setTimeout( async () => {
                try {
                    await this.sendLog('log', `WILL FOLLOW ---> ${willFollow[idx]}`);
                    await steem.broadcast.customJson(this.key, [], [this.user], 'follow', willFollow[idx]);
                    await this.sendLog('log', `FOLLOWED SUCCESSFULLY`);
                    if ( idx == willFollow.length-1) {
                        await this.sendLog('log',' Job Terminated');
                    }
                    this.follow(willFollow, idx+1);
                } catch (error) { await this.sendLog('error', error); }
            }, 8000);
        }
    }

    private async getUsersToBeFollowed(followers: any, following: any, user: string) {
        const toFollow = [];
        await this.sendLog('log','DETERMINING USERS TO FOLLOW BASED ON A SIMPLE ALGORITHM');
        for (let follower of followers) {
            const val = follower['follower'];
            let exists = false;
            for (let idx in following) {
                if (val === following[idx]['following']) {
                    following.splice(parseInt(idx, 10), 1);
                    exists = true;
                    break;
                }
            }
            if (!exists) { toFollow.push(follower); }
        }
        return this.getFollowUsersRequests(user, toFollow);
    }

    private getFollowUsersRequests(user: string, toFollow: any[]) {
        return toFollow.map( (willFollow) => SteemController.createJSONRequest(user, willFollow['follower']))
    }

    static createJSONRequest(user: string, toFollow: string) {
        return JSON.stringify([
            'follow', {
                follower: user,
                following: toFollow,
                what: ['blog']
            }
        ]);
    }
}
