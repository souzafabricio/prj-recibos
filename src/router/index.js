import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/clientes',
    name: 'clientes',
    component: () => import(/* webpackChunkName: "clientes" */ '../views/Clientes.vue')
  },
  {
    path: '/servicos',
    name: 'servicos',
    component: () => import(/* webpackChunkName: "servicos" */ '../views/Servicos.vue')
  },
  {
    path: '/recibos',
    name: 'recibos',
    component: () => import(/* webpackChunkName: "recibos" */ '../views/Recibos.vue')
  },
  {
    path: '/CadastroCliente',
    name: 'CadastroCliente',
    component: () => import(/* webpackChunkName: "cadastroCliente" */ '../views/CadastroCliente.vue')
  },
  {
    path: "/editarCliente/:id",
    name: "EditarCliente",
    component: () => import("@/views/EditarCliente.vue"),
  },
  {
    path: '/CadastroServico',
    name: 'CadastroServico',
    component: () => import(/* webpackChunkName: "cadastroServico" */ '../views/CadastroServico.vue')
  },
  {
  path: '/EditarServico/:id',
  name: 'EditarServico',
  component: () => import('@/views/EditarServico.vue'),
  },
  {
    path: '/Ajuda',
    name: 'Ajuda',
    component: () => import(/* webpackChunkName: "cadastroCliente" */ '../views/Ajuda.vue')
  },
  {
    path: '/Sobre',
    name: 'Sobre',
    component: () => import(/* webpackChunkName: "cadastroCliente" */ '../views/Sobre.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
