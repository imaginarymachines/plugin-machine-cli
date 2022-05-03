
import { AxiosResponse } from 'axios';
//@ts-ignore
import {LocalFileData} from 'get-file-object-from-local-path';
//@ts-ignore
import Vapor from 'laravel-vapor'
import axios from 'axios';
const API = {
    'root': `https://ci.pluginmachine.dev`,
    'sign': `/api/upload/sign`,
    'ack': `/api/upload/ack`
}

function pmCiApi(token:string){
    const headers ={
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }

    return {
        uploadVersion(
            file:File,
            pluginId: number
        ):Promise<LocalFileData>{
            let options = {
                content_type: file.type,
                signedStorageUrl: `${API.root}${API.sign}`,
                visibility: "private",
                //@ts-ignore
                progress: progress => {
                    console.log({progress});
                },
                headers
            };
            return new Promise( (resolve,reject) => {
                //Upload file
                Vapor.store(file, options).catch(e => console.log({e}))
                    .then((response:void|AxiosResponse) => {
                        console.log(response.data);
                        axios.post(`${API.root}${API.ack}`, {
                            //@ts-ignore
                            uuid: response.uuid,
                            //@ts-ignore
                            key: response.key,
                            name: file.name,
                            pluginId,
                        },{headers}).then( (r:void|AxiosResponse) => {
                            if(r && r.data.uuid){
                                //@ts-ignore
                                resolve({uuid:r.data.uuid})
                            }
                            reject(false);
                        })
                    });
            });

        }
    }
}




export default pmCiApi;
