import { Router } from "express";

const router = Router()

router.get('/', (req,res) => {
  res.send("Arquitectura en Capas")
})

export default router

