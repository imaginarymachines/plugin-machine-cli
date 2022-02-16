import {info} from './log';
import {existSuccess,exitError} from './exit';

/**
 * WordPress CLI helper functions
 * @param {(command:string): Promise<any}>} wp An async function that runs a WP CLI command.
 */
export default function wp(wp){
    return {
        /**
         * Install WordPress for the WordPress site.
         */
        install: async ({url,title}) => {
            info('Installing WordPress');
            //This user is intentionally fake
            return wp(`core install --url=${url} --title="${title}" --admin_user=admin0 --admin_email=something@example.com`)
                .then(existSuccess).catch(exitError);
        },
        /**
         * Reset WordPress Database
         */
         resetWordPress:async () => {
            info('Resetting WordPress');
            return wp('db reset --yes')
                .then(existSuccess).catch(exitError);
        },
        /**
         * Create an admin user
         */
        createAdminUser: async ({username,email,password}) =>{
            info('Creating admin user');
            await wp(`user create ${username} ${email} --role=administrator --user_pass=${password}`)
                .catch( ()=> {
                    info(`Admin user ${username} already exists`);
                    info('This is OK');
                })
        },
        /**
         * Activate a plugin
         */
        activatePlugin:async ({slug}) => {
            info('Activating plugin');
            return wp(`plugin activate ${slug}`)
                .then(existSuccess).catch(exitError);
        }

    }
}
