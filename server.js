import express, {json} from 'express'; 
import cors from 'cors'
import router from './src/routes/router.js';




const app = express()
app.use(cors())
app.use(json())
app.use(router)


app.listen(9000, ()=>{
    console.log("BACK END RODANDO!")
})