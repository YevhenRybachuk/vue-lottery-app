import { UserService } from './user.service'

export const ServiceProvider = {
    users: new UserService(),
}