import { UserService } from './user.service'
import { AuthService } from './auth.service'

export const ServiceProvider = {
    users: new UserService(),
    auth: new AuthService()
}