jest.mock('../../data/dbContext');
jest.mock('../../data/repositories/userRepository');
jest.mock('../../data/repositories/baseRepository');
jest.mock('../../data/repositories/roleRepository');
jest.mock('bcrypt');

const bcrypt = require('bcrypt');
const userRepository = require('../../data/repositories/userRepository');

const userService = require('../../logic/services/userService');
const User = require('../../models/User');
const ApplicationError = require('../../logic/errors/ApplicationError');
const ValidationError = require('../../logic/errors/ValidationError');

const id = 1;
const username = 'some_username';
const email = 'mail@mail.com';
const password = 'psswrd';
const rolesIds = [1];
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ';

const user = new User(username, email, password, rolesIds);
user.id = id;

describe('register function', () => {
    userRepository.create.mockReturnValue(user);

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('correct params should return jwt', async () => {
        const result = await userService.register(username, email, password);
        expect(result).toContain(token);
    });

    test('existing user should throw exception', async () => {
        userRepository.getByUsername.mockReturnValue(user);
        await expect(userService.register(username, email, password)).rejects.toThrow(ApplicationError);
    });

    test('wrong username should throw validationError', async () => {
        await expect(userService.register('w', email, password)).rejects.toThrow(ValidationError);
    });

    test('wrong email should throw validationError', async () => {
        await expect(userService.register(username, 'not email', password)).rejects.toThrow(ValidationError);
    });

    test('should invoke userRepository.create', async () => {
        const fn = jest.fn(() => user);
        userRepository.create = fn;
        await userService.register(username, email, password);
        expect(fn).toBeCalled();
    });
});

describe("login function", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    const entryData = 'some_username';

    test('login with username should return jwt', async () => {
        bcrypt.compareSync.mockReturnValue(true);
        userRepository.getByUsername.mockReturnValue(user);
        const result = await userService.login(entryData, password);
        expect(result).toContain(token);
    });

    test('login with not existing entry data should throw error', async () => {
        userRepository.getByUsername = () => false;
        await expect(userService.login(entryData, password)).rejects.toThrow(ApplicationError);
    });
});

describe('check', () => {
    test('should generate jwt', async () => {
        const result = await userService.check(id, username, email, rolesIds);
        expect(result).toContain(token);
    });
});

describe('changeUsername', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('correct data should return changed user', async () => {
        userRepository.getById.mockReturnValue(user);
        user.username = 'new';
        userRepository.update.mockReturnValue(user);

        const result = await userService.changeUsername(user.id, 'new');
        expect(result).toEqual(user);
        user.username = username;
    });

    test('wrong data should throw ValidationError', async () => {
        userRepository.getById.mockReturnValue(user);

        await expect(userService.changeUsername(user.id, 'a')).rejects.toThrow(ValidationError);
    });
});

describe('changeEmail', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('correct data should return changed user', async () => {
        userRepository.getById.mockReturnValue(user);
        user.email = 'new@mail.com';
        userRepository.update.mockReturnValue(user);

        const result = await userService.changeUsername(user.id, 'new');
        expect(result).toEqual(user);
        user.email = email;
    });

    test('wrong data should throw ValidationError', async () => {
        userRepository.getById.mockReturnValue(user);

        await expect(userService.changeEmail(user.id, 'not email')).rejects.toThrow(ValidationError);
    });
});

describe('changePassword', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('correct data should return changed user with undefined password', async () => {
        const user = new User(username, email, password, rolesIds);
        user.id = id;
        userRepository.getById.mockReturnValue(user);
        bcrypt.compareSync.mockReturnValue(true);
        userRepository.update.mockReturnValue(user);

        const result = await userService.changePassword(user.id, password, 'newPass');
        expect(result).not.toBeNull();
        expect(result.password).toBeUndefined();
    });

    test('wrong data should throw ValidationError', async () => {
        const user = new User(username, email, password, rolesIds);
        user.id = id;
        userRepository.getById.mockReturnValue(user);
        bcrypt.compareSync.mockReturnValue(true);

        await expect(userService.changePassword(user.id, password, '12')).rejects.toThrow(ValidationError);
    });
});

describe('changeRoles', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('', () => {

    });
});
