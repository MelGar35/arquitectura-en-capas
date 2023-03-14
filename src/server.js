import express from "express"
import handlebars from "express-handlebars"
import __dirname from "./dirname.js"
import routes from "../src/routes/index.routes.js"
import mongoose from "mongoose"
import Handlebars from "handlebars"
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access"
import path from "path"
import initializePassport from "./src/config/passport.config.js"
import passport from "passport"
import cors from "cors"
import cookieParser from "cookie-parser"
import config from "./src/config/config.js"

//Configuracion del servidor
const app = express()

//MongoDB local
mongoose.set('strictQuery', true)
mongoose.connect(config.MONGO_URI, (error) => {
  if(error) {
    console.log('Error al conectar a MongoDB', error)
  } else {
    console.log('Conectado a MongoDB')
    process.exit
  }
})

//Handlebars
app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    defaultLayout: 'main.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
  }))
  
  app.set('view engine', 'hbs')
  app.set('views', `${__dirname}/views`)
  app.use(express.static(`${__dirname}/public`))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())
  
 //Routes
  app.use('/api', routes)

//Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//Cors
  app.use(
    cors({
      credentials: true,
      origin:
        process.env.NODE_ENV === "production"
          ? process.env.CLIENT_URL
          : "http://localhost:3000",
    }))

 
  
