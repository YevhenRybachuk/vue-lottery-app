import { UserService } from '@/entities/user'
import { AuthService } from '@/entities/session'

export const ServiceProvider = {
    users: new UserService(),
    auth: new AuthService()
}