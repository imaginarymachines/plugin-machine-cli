
import { AxiosResponse } from 'axios';
//@ts-ignore
import {LocalFileData} from 'get-file-object-from-local-path';
//@ts-ignore
import Vapor from 'laravel-vapor'
import axios from 'axios';
const API = {
    'root': `https://gentle-sands-hanbpakaz3zp.vapor-farm-f1.com`,
    'sign': `/api/upload/sign`,
    'ack': `/api/upload/ack`
}

function pmCiApi(){

    return {
        uploadVersion(
            file:File,
            pluginId: number
        ):Promise<LocalFileData>{
            return new Promise( (resolve,reject) => {
                //Upload file
                Vapor.store(file, {
                    content_type: file.type,
                    signedStorageUrl: `${API.root}${API.sign}`,
                    visibility: "private",
                    //@ts-ignore
                    progress: progress => {
                        console.log({progress});
                    }
                })
                    .then((response:void|AxiosResponse) => {
                        axios.post(`${API.root}${API.ack}`, {
                            //@ts-ignore
                            uuid: response.uuid,
                            //@ts-ignore
                            key: response.key,
                            name: file.name,
                            pluginId,
                        }).then( (r:void|AxiosResponse) => {
                            if(r && r.data.uuid){
                                console.log(r.data);
                                //@ts-ignore
                                resolve({uuid:data.uuid})

                            }
                            reject(false);
                        })
                    });
            });

        }
    }
}




export default pmCiApi;
