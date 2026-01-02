/**
 * @author Rawir
 */

import crypto from 'crypto';

function login(username: string) {
    let UUID = crypto.randomBytes(16).toString('hex');

    return {
        access_token: UUID,
        client_token: UUID,
        uuid: UUID,
        name: username,
        user_properties: '{}',
        meta: {
            online: false,
            type: 'Mojang'
        }
    }
}

export { login as login }