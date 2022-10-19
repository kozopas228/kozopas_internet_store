const axios = require('axios');
const config = require('../config');
const httpStatusCodes = require('../../consts/httpStatusCodes');
const uuid = require('uuid');
const jwtDecode = require('jwt-decode');
const chance = require('chance').Chance();

const baseUrl = config.baseUrl;
const apiUrl = config.apiUrl;
const port = config.applicationPort;

const url = `${baseUrl}:${port}${apiUrl}`;

describe('check', () => {

    const path = url + '/check';
    test('GET without auth headers should return error with status code', async () => {
        try {
            await axios.get(path);
        } catch(error) {
            const response = error.response;
            expect(response.data).toEqual({message: 'not authorized user, fuck'});
            expect(response.status).toEqual(httpStatusCodes.UNAUTHORIZED);
        }
    });

    test('GET with correct headers should return jwt', async () => {
        const loginResponse = await axios.post(url + '/login', {
            entryData: 'kozopas',
            password: 'test'
        });
        const loginJwt = loginResponse.data.token;


        const response = await axios.get(path, {
            headers: {
                'authorization' : `Bearer ${loginJwt}`
            }});

        const result = response.data.token;
        expect(result).toMatch(/^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/);
    });

    test('GET with wrong jwt should return error', async () => {
        try {
            await axios.get(path, {
                headers: {
                    'authorization' : `wrong jwt`
                }});
        } catch (error) {
            const response = error.response;
            expect(response.status).toEqual(httpStatusCodes.UNAUTHORIZED);
        }
    });
});

describe('login', () => {
    const path = url + '/login';

    test('POST with not set params should return error', async () => {
        try {
            await axios.post(path);
        } catch (error) {
            const response = error.response;
            expect(response.status).toEqual(httpStatusCodes.BAD_REQUEST);
            expect(response.data).toEqual({message: 'one of fields were empty'});
        }
    });

    test('POST with correct by not existed data should return error', async () => {
        try {
            await axios.post(path, {entryData: 'bebebe', password: 'bababa'});
        } catch (error) {
            const response = error.response;
            expect(response.status).toEqual(httpStatusCodes.BAD_REQUEST);
            expect(response.data).toEqual({message: 'user was not found'});
        }
    });

    test('POST with correct data should return jwt', async () => {
        const response = await axios.post(path, {entryData: 'kozopas', password: 'test'});
        const jwt = response.data.token;
        expect(jwt).toMatch(/^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/);
    });
});

describe('register', () => {
    const path = url + '/register';

    test('POST with not set params should return error', async () => {
        try {
            await axios.post(path);
        } catch (error) {
            const response = error.response;
            expect(response.status).toEqual(httpStatusCodes.BAD_REQUEST);
            expect(response.data).toEqual({message: 'one of fields were empty'});
        }
    });

    test('POST with existing user should return error', async () => {
        try {
            await axios.post(path, {username: 'kozopas', email: 'test', password: '123'});
        } catch(error) {
            const response = error.response;
            expect(response.status).toEqual(httpStatusCodes.BAD_REQUEST);
            expect(response.data).toEqual({message: "user already exists"});
        }
    });

    test('POST with not valid user should return error', async () => {
        try {
            await axios.post(path, {username: 'a', email: 'b', password: 'c'});
        } catch(error) {
            const response = error.response;
            expect(response.status).toEqual(httpStatusCodes.BAD_REQUEST);
            expect(response.data.message).toEqual("validation failed");
        }
    });

    test('POST user with correct data should return jwt', async () => {
        const guid = uuid.v4();

        const response = await axios.post(path, {
            username: guid,
            email: guid + '@mail.com',
            password: 'P@ssw0rd'
        });

        const result = response.data.token;
        expect(response.status).toBe(httpStatusCodes.CREATED);
        expect(result).toMatch(/^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/);
    });
});

describe('changeUsername', () => {
    const path = url + '/changeUsername';
    let jwt;
    let decoded;

    beforeAll(async () => {
        const registerResponse = await axios.post(url + '/register', {
            username: chance.string({ length: 8, casing: 'upper', alpha: true, numeric: true }, ),
            email: chance.string({ length: 8, casing: 'upper', alpha: true, numeric: true }, ) + '@mail.com',
            password: 'some_password'
        });
        jwt = registerResponse.data.token;
        decoded = jwtDecode(jwt);
    });

    test('POST with not set params should return error', async () => {
        try {
            await axios.post(path, {}, {headers: {'authorization': `Bearer ${jwt}`}})
        } catch (error) {
            const response = error.response;
            expect(response.status).toEqual(httpStatusCodes.BAD_REQUEST);
            expect(response.data).toEqual({message: 'one of fields were empty'});
        }
    });

    test('POST with correct params should change username', async () => {
        const newUsername = chance.string({ length: 8, casing: 'upper', alpha: true, numeric: true }, );
        await axios.post(path, {username: newUsername}, {headers: {'authorization': `Bearer ${jwt}`}})
        const _loginResponse = await axios.post(url + '/login', {entryData: newUsername, password: 'some_password'});

        expect(_loginResponse.data.token).toMatch(/^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/);

    });
});

describe('changeEmail', () => {
    const path = url + '/changeEmail';
    let jwt;
    let decoded;

    beforeAll(async () => {
        const registerResponse = await axios.post(url + '/register', {
            username: chance.string({ length: 8, casing: 'upper', alpha: true, numeric: true }, ),
            email: chance.string({ length: 8, casing: 'upper', alpha: true, numeric: true }, ) + '@mail.com',
            password: 'some_password'
        });
        jwt = registerResponse.data.token;
        decoded = jwtDecode(jwt);
    });

    test('POST with not set params should return error', async () => {
        try {
            await axios.post(path, {}, {headers: {'authorization': `Bearer ${jwt}`}})
        } catch (error) {
            const response = error.response;
            expect(response.status).toEqual(httpStatusCodes.BAD_REQUEST);
            expect(response.data).toEqual({message: 'one of fields were empty'});
        }
    });

    test('POST with correct params should change email', async () => {
        const newEmail = chance.string({ length: 8, casing: 'upper', alpha: true, numeric: true }, )+'@mail.com';
        await axios.post(path, {email: newEmail}, {headers: {'authorization': `Bearer ${jwt}`}})
        const _loginResponse = await axios.post(url + '/login', {entryData: newEmail, password: 'some_password'});

        expect(_loginResponse.data.token).toMatch(/^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/);

    });
});

describe('changePassword', () => {
    const path = url + '/changePassword';
    let jwt;
    let decoded;

    beforeAll(async () => {
        const registerResponse = await axios.post(url + '/register', {
            username: chance.string({ length: 8, casing: 'upper', alpha: true, numeric: true }, ),
            email: chance.string({ length: 8, casing: 'upper', alpha: true, numeric: true }, ) + '@mail.com',
            password: 'some_password'
        });
        jwt = registerResponse.data.token;
        decoded = jwtDecode(jwt);
    });

    test('POST with not set params should return error', async () => {
        try {
            await axios.post(path, {}, {headers: {'authorization': `Bearer ${jwt}`}})
        } catch (error) {
            const response = error.response;
            expect(response.status).toEqual(httpStatusCodes.BAD_REQUEST);
            expect(response.data).toEqual({message: 'one of fields were empty'});
        }
    });

    test('POST with wrong old password should return error', async () => {
        try {
            const newPassword = 'another_password';
            await axios.post(path, {oldPassword: 'wrong_old_password', newPassword: newPassword}, {headers: {'authorization': `Bearer ${jwt}`}})
        } catch(e) {
            const response = e.response;
            expect(response.data).toEqual({ message: 'wrong password' });
        }
    });

    test('POST with correct params should change password', async () => {
        const newPassword = 'another_password';
        await axios.post(path, {oldPassword: 'some_password', newPassword: newPassword}, {headers: {'authorization': `Bearer ${jwt}`}})
        const _loginResponse = await axios.post(url + '/login', {entryData: decoded.username, password: 'another_password'});

        expect(_loginResponse.data.token).toMatch(/^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/);

    });
});

describe('changeRoles', () => {
    const path = url + '/changeRoles';

    let jwt;

    beforeAll(async () => {
        const loginResponse = await axios.post(url + '/login', {entryData: 'admin', password: 'admin'});
        jwt = loginResponse.data.token;
    });

    test('POST with not set params should return error', async () => {
        try {
            await axios.post(path, {}, {headers: {'authorization': `Bearer ${jwt}`}})
        } catch (error) {
            const response = error.response;
            expect(response.status).toEqual(httpStatusCodes.BAD_REQUEST);
            expect(response.data).toEqual({message: 'one of fields were empty'});
        }
    });

    test('POST with right rights should change role', async () => {
        const response = await axios.post(path, {id: 1, rolesIds: [1, 2]}, {headers: {'authorization': `Bearer ${jwt}`}});
        expect(response.data).toEqual({ message: 'changed' });
    });

    test('POST with wrong right should throw error', async () => {
        const loginResponse = await axios.post(url + '/login', {entryData: 'andrii', password: 'adasd'});
        const loginJwt = loginResponse.data.token;
        try {
            await axios.post(path, {id: 2, rolesIds: [1, 2]}, {headers: {'authorization': `Bearer ${loginJwt}`}});
        } catch (e) {
            const response = e.response;
            expect(response.data).toEqual({message: 'not enough rights'});
        }
    });

    test('POST with wrong right should not change roles', async () => {
        const loginResponse = await axios.post(url + '/login', {entryData: 'andrii', password: 'adasd'});
        const loginJwt = loginResponse.data.token;
        try {
            await axios.post(path, {id: 2, rolesIds: [1, 2]}, {headers: {'authorization': `Bearer ${loginJwt}`}});
        } catch (e) {
            const loginResponseNew = await axios.post(url + '/login', {entryData: 'andrii', password: 'adasd'});
            const loginJwtNew = loginResponseNew.data.token;
            const decoded = jwtDecode(loginJwtNew);

            expect(decoded.rolesIds).toEqual([1]);
        }
    });
});