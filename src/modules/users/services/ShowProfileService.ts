import User from "@modules/users/infra/typeorm/entities/User";
import AppError from '@shared/errors/AppError';
import IUsersRepository from "../repositories/IUsersRepositories";
import {inject, injectable} from 'tsyringe';

interface IRequest {
    user_id: string;
}


@injectable()
class ShowProfileService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        ) {}

    public async execute({ user_id }: IRequest): Promise<User> {

        const user = await this.usersRepository.findById(user_id);

        if(!user){
            throw new AppError('User not found')
        }

        delete user.password;

        return user;

    }
}

export default ShowProfileService;
