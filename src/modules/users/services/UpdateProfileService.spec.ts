import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from  './UpdateUserAvatarService';
import AppError from '@shared/errors/AppError';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider)
    })

    it('should be able to update user profile', async () => {

        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: 'johndoe@example.com',
            password: '123456'
        })

       const updatedUser =  await updateProfile.execute({
            user_id: user.id,
            name: "John Tre",
            email: "johntre@example.com",
        })

        expect(updatedUser.name).toBe('John Tre');
        expect(updatedUser.email).toBe('johntre@example.com');
    })

    it('should not be able to show the profile from non-existing user', async () => {

        await expect(updateProfile.execute({
            user_id: 'non-existing-id',
            name: "John Tre",
            email: "johntre@example.com",
        })).rejects.toBeInstanceOf(AppError)
     })

    it('should not be able to change to another user email', async () => {

         await fakeUsersRepository.create({
            name: "John Doe",
            email: 'johndoe@example.com',
            password: '123456'
        })


      const user = await fakeUsersRepository.create({
            name: "Teste",
            email: 'teste@example.com',
            password: '123456'
        })


       await expect(updateProfile.execute({
            user_id: user.id,
            name: "John Tre",
            email: "johndoe@example.com",
        })).rejects.toBeInstanceOf(AppError)
    })

    it('should be able to update the password', async () => {

        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: 'johndoe@example.com',
            password: '123456'
        })

       const updatedUser =  await updateProfile.execute({
            user_id: user.id,
            name: "John Tre",
            email: "johntre@example.com",
            password: '123123',
            old_password: '123456'
        })

        expect(updatedUser.password).toBe('123123');
    })

    it('should not be able to update the password without old password', async () => {

        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: 'johndoe@example.com',
            password: '123456'
        })

       await expect(updateProfile.execute({
            user_id: user.id,
            name: "John Tre",
            email: "johntre@example.com",
            password: '123123',
        })).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to update the password with wrong old password', async () => {

        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: 'johndoe@example.com',
            password: '123456'
        })

       await expect(updateProfile.execute({
            user_id: user.id,
            name: "John Tre",
            email: "johntre@example.com",
            password: '123123',
            old_password: '121212'
        })).rejects.toBeInstanceOf(AppError)
    })

})
