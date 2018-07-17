import { Router } from 'express';
import {ObjectID} from "bson";
import agenda from "../../agenda/agenda";
import logger from "../../util/logger";
import DBClient from "../../database/dbClient";
const ObjectId = require('mongodb').ObjectID;

let router = Router();

router.post('/', async (req, res) => {
    const acc = req.body.acc;
    let logs: any = {};
    let ids: ObjectID[] = [];
    try {
        const jobs = await agenda.getUserJobs({"data.username": acc.user});
        jobs.forEach((job: any) => {
            const temp = JSON.parse(JSON.stringify(job));
            logs[temp['_id']] = [];
            ids.push(ObjectId(temp['_id']));
        });
        const what = await DBClient.find({_id: { $in : ids}}, 'logs');
        what.forEach((jobLogs) => {
           logs[jobLogs._id] = jobLogs.logs;
        });
        res.status(200).send(logs);
    } catch (error) { res.status(500).send({err: '500'}); }
});

export let logsRouter = router;
