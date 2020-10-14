import { getRepository, Repository } from 'typeorm';
import IUsersRepository from '@modules/users/repositories/IUsersRepositories';
import UserToken from '../entities/UserToken';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';


class UserTokensRepository  implements IUserTokensRepository {
    private ormRepository: Repository<UserToken>;

    constructor() {
        this.ormRepository = getRepository(UserToken);
    }

    public async findByToken(token: string): Promise<UserToken | undefined> {

        const userToken = await this.ormRepository.findOne({
            where: {token}
        });

        return userToken;
    }

    public async generate(user_id: string): Promise<UserToken> {
        const userToken = this.ormRepository.create({
            user_id,
        })

        await this.ormRepository.save(userToken);

        return userToken;
    }
}

export default UserTokensRepository;
