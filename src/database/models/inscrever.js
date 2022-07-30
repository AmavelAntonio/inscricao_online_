import conect from '../conectDB.js'
import Sequelize  from "sequelize";

const InscritosModel = conect.define('inscritos', {

    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true, 
        allowNull: false,
        primaryKey: true
    }, 
    name: {
        type: Sequelize.STRING,
        allowNull: false, 
    }, 
    Bi: {
        type: Sequelize.STRING, 
        allowNull: false
    }, 
    cellphone: {
        type: Sequelize.STRING, 
        allowNull: false
    }, 
    ocupattion: {
        type: Sequelize.STRING, 
        allowNull: false
    }, 
    province: {
        type: Sequelize.STRING, 
        allowNull: false
    }, 
    howKnowAboutUs: {
        type: Sequelize.STRING, 
        allowNull: false
    }, 
    Status: {
        type: Sequelize.BOOLEAN, 
        default: false, 
        allowNull: true
    }
    
})


//InscritosModel.sync({force: true});


export default InscritosModel; 
