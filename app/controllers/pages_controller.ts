import type { HttpContext } from '@adonisjs/core/http'

export default class PagesController {
  async home({ inertia }: HttpContext) {
    return inertia.render('home', {})
  }

  async learn({ inertia }: HttpContext) {
    return inertia.render('learn', {})
  }
}
