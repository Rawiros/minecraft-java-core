/**
 * @author Rawir
 */
declare function login(username: string): {
    access_token: string;
    client_token: string;
    uuid: string;
    name: string;
    user_properties: string;
    meta: {
        online: boolean;
        type: string;
    };
};
export { login as login };
