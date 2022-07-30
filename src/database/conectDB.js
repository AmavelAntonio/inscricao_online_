import sequelize from "sequelize";


const conect = new sequelize('inscricao', 'root', '', {
    dialect: 'mysql', 
    host: 'localhost'
})

export default conect; 