import { Router } from 'express';
import api from './api';

const router = Router();

router.use('/api', api);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

export default router;
