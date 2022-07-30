import express, { response, Router } from 'express';
import inscricao from '../controller/inscricao.js'

const router = express.Router()


router.get('/new-inscricao', inscricao.store);
router.get('/create-invoice', inscricao.pdf)
router.get('/comprovativo', inscricao.createpdf)

router.get('/', (require, response) => {
    return response.json({
        "Mensagem": "Deu certo"
    })
})






export default router; 