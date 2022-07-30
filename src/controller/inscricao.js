import { response } from 'express';
import conect from '../database/conectDB.js'
import inscrever from '../database/models/inscrever.js'


//Gerar pdf IMPORT PACKAGES
import easyinvoice from 'easyinvoice'; 
import fs from 'fs';   
import path from 'path';
import pdfkit from 'pdfkit';

const documento = new pdfkit;






export default {
    async store(require, response){

        const {name, cellphone, ocupattion, province, howknowAboutUs, Bi } = require.body; 

        if(!name || name.length < 5) return response.json({
            "Mensagem": "Nome inválido", error: true
        })

        if(!cellphone || cellphone.length < 9) return response.json({
            "Mensagem": "Contacto inválido", error: true
        })

       /* BI */
                   //validando os dados do usuario
     const letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
     const numeros = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
     let arrayNumberBi = [];
     let biString = String(Bi).toUpperCase()
     let caracteres = biString.split('');
     let indexLetras1 = -1;
     let indexLetras2 = -1;
     let arrayNumeros1 = caracteres.slice(0, 8);
     let arrayNumeros2 = caracteres.slice(11)
     let cont2 = 0;
     let cont = 0;
 
     //validando os caracteres do número do bi

     if(!Bi){
         return response.status(401).json({Mensagem: "Bilhete de Identidade não pode ser inválido", error: true})
     }
     
    
     if(Bi.length !== 14){
         return response.status(401).json({Mensagem: "Número do Bilhete de identidade inválido", error: true})
     }

     let arrayLetraBi = letras.filter( function (e) {
         for(let i = 0; i < letras.length; i++){
             for (let y = letras.length - 1; y >= 1; y-- ){
                 if(caracteres[y] == e) return caracteres[y]
             }
         }   
     })

     if(arrayLetraBi.length > 2) return response.status(401).json({Mensagem: "Bilhete de identidade inválido", error: true})

    if(caracteres[9] == arrayLetraBi[1]) indexLetras1 = true;

    if(caracteres[10] == arrayLetraBi[0]) indexLetras2 = true

    if(indexLetras1 !== true && indexLetras2 !== true)
       return response.status(401).json({Mensagem: "Bilhete de identidade inválido2", error: true})
 
     
   for(let i = 0; i < arrayNumeros1.length; i++){
       for(let y = 0; y < numeros.length; y++){
             if(arrayNumeros1[i] == numeros[y])
                cont++;
       }
   }

   if(cont !== 8){
     return response.status(401).json({Mensagem: "Bilhete de identidade inválido", error: true})
   }

  
   for(let i = 0; i < arrayNumeros2.length; i++){
       for(let y = 0; y < numeros.length; y++){
           if(arrayNumeros2[i] == numeros[y])
             cont2++;
       }
   }
   if(cont2 !== 3 ){
     return response.status(401).json({Mensagem: "Bilhete de identidade inválido", error: true})
   }


   const existBi = await inscrever.findOne({
    where: {
        Bi: Bi
    }
   })

   if(existBi) return response.status(401).json({
    "Mensagem": "Já existe um usuário com este Bilhete de identidade, insira a identidade correcta, obrigado", error: true
   })


       /* END UP BI */

        const existCellphone = await inscrever.findOne({
            where: {
                cellphone: cellphone
            }
        })

        if(existCellphone) return response.json({"Mensagem": "Contacto usado por outro usuário, insira o seu contacto", error: true})

        if(!ocupattion || ocupattion.length < 5) return response.json({
            "Mensagem": "Ocupação inválida", error: true
        })

        if(!province || province.length < 4) return response.json({
            "Mensagem": "Provincia Inválida", error: true
        })

        if(!howknowAboutUs) return response.json({
            "Mensagem": "Este Campo é obrigatório"
        })


        try{
            const newInscritos = await inscrever.create({
                name, 
                Bi, 
                cellphone, 
                ocupattion, 
                province, 
                howKnowAboutUs: howknowAboutUs
            })

            return await response.status(200).json({
                "Mensagem": "Inscrição efectuada com sucesso", dates: newInscritos
            }) 
        }catch(error){
            return response.json({"Mensagem": "Error in our service", error: error })
        }
        
    },

    async pdf(require, response){
        const today = new Date()
        var data = {
            "currency": "AKZ",
            "taxiNotation": "vat", 
            "marginTop": 25, 
            "marginRight": 25, 
            "marginLeft": 25, 
            "marginBottom": 25, 

            "customize": {
                //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html 
            },
            "images": {
                // The logo on top of your invoice
                "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png",
                // The invoice background
               // "background": "https://public.easyinvoice.cloud/img/watermark-draft.jpg"
            },
            // Your own data
            "sender": {
                "company": "Julina Soba Coding",
                "address": "Largo Soweto",
                "zip": "1234 AB",
                "city": "Luanda",
                "country": "Angola"
            },
            // Your recipient
            "client": {
                "company": "Amavel",
                "address": "Viana, Ponte Partida",
                "zip": "4567 CD",
                "city": "Luanda",
                "country": "Angola"
            },
            "information": {
                // Invoice number
                "number": "2021.0001",
                // Invoice data
                "date": today,
                // Invoice due date
                "due-date": "31-12-2021"
            },
            // The products you would like to see on your invoice
            // Total values are being calculated automatically
            "products": [
                {
                    "quantity": 1,
                    "description": "Convite de ingresso",
                    "tax-rate": 6,
                    "price": 2000
                },
            ],

            "bottomNotice": "Por favor, pague a sua factura!"
        }

     
     
            const invoicePdf = async () =>{
                await easyinvoice.createInvoice(data, function (result) {
                    fs.writeFileSync(`./invoice/invoice${Date.now()}.pdf`, 
                    result.pdf, 'base64')    
            })
        }

        invoicePdf(); 
        return response.status(200).json({"Massa": "Muito massa"})
   
    }, 


    async createpdf(require, response){
        let index = 1
        try{
            await documento.pipe(fs.createWriteStream(`Comprovativo${index}.pdf`))
            await documento.text("Hello World")
            .fontSize(25)

        return response.status(200).json("Comprovativo Gerado");
        /*
        documento.image('image.pgn', {
            fit: [250, 350], 
            align: 'center', 
            valign: 'center'
        })
        */
        }catch(error){
            return response.status(400).json({"Mensagem": "Falha no servidor, tente novamente dentro de uma hora"})
        }




    }
}