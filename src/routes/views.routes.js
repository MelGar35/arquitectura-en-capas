import { Router } from "express";

const router = Router()

router.get('/', async (req, res) => {
  res.render('index')
})

router.get('/edit/:id', async (req, res) => {
  const product = await productsDao.getById(req.params.id);
  res.render('edit', { title: 'Edit', product })
})

export default router

