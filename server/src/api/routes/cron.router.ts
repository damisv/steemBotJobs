import { Router } from 'express';
import agenda from '../../agenda/agenda';
import logger from "../../util/logger";

let router = Router();

router.post('/', async (req: any, res) => {
    const acc = req.body.acc;
    try {
        const temp = await agenda.getUserJobs({"data.username": acc.user});
        res.status(200).send(temp);
    } catch (error) { res.status(500).send({err: '500'}); }
});

router.post('/create', async (req: any, res) => {
    const job = req.body.job;
    try {
        await agenda.addJob(job.interval, job.name, job.data);
        res.status(204).send();
    } catch (error) { res.status(500).send({err: '500'}); }
});

router.post('/cancel', async (req: any, res) => {
    try {
        const temp = await agenda.cancelJobBy(req.body.id);
        res.status(204).send();
    } catch (error) { res.status(500).send({err: '500'}); }
});

export let cronRouter = router;
