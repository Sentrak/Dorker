import router from '@adonisjs/core/services/router'

const PagesController = () => import('#controllers/pages_controller')

router.get('/', [PagesController, 'home']).as('home')
router.get('/apprendre', [PagesController, 'learn']).as('learn')
