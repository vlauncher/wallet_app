import { Router } from 'express';
import usersControllers from '../controllers/users.controllers';

const router = Router();

router.post('/register', usersControllers.register);
router.post('/login', usersControllers.login);
router.delete('/drop', usersControllers.deleteAllUsers);


export default router;