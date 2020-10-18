import * as express from 'express'
import { Request, Response } from 'express'
import IPost from './post.interface'
import IControllerBase from 'interfaces/IControllerBase.interface'

class PostsController implements IControllerBase {
    public pathV1 = '/api/v1/parse'
    public pathV2 = '/api/v2/parse'
    public router = express.Router()

    constructor() {
        this.initRoutes()
    }

    public initRoutes() {
        this.router.post(this.pathV1, this.handlePostV1)
        this.router.post(this.pathV2, this.handlePostV2)
    }

    private parseText = (text: string, isV1: boolean): IPost => {
        const parsed:IPost = {
            firstName: "",
            lastName: "",
            clientId: ""
        }
        let temp = [];
        let splitCheck = false;
        let splitEnd = false;
        for (let a = 0; a < text.length; a++) {
            if (text[a + 1] == '0' || typeof text[a + 1] === 'undefined') {
                splitCheck = true;
            }
            if(!isV1 && text[a] != "0"){
                temp.push(text[a]);
            } else if(isV1){
                temp.push(text[a]);
            }
            
            if (splitCheck && (text[a + 1] !== '0' || typeof text[a + 1] === 'undefined')) {
                splitCheck = false;
                splitEnd = true;
            }
            if (!splitCheck && splitEnd) {
                if (!parsed.firstName) {
                    parsed.firstName = temp.join('');
                } else if (!parsed.lastName) {
                    parsed.lastName = temp.join('');
                } else if (!parsed.clientId) {
                    if(!isV1){
                        temp.splice(3, 0, '-');
                        parsed.clientId = temp.join('');
                    } else {
                        parsed.clientId = temp.join('');
                    }
                }
                temp = [];
                splitCheck = false;
                splitEnd = false;
            }
        }
        return parsed;
    }

    handlePostV1 = (req: Request, res: Response) => {
        if(req.body && req.body.data){
            const parsedData = this.parseText(req.body.data, true)
            res.send(parsedData)
        } else {
            res.send("Not a valid request body!")
        }
    }

    handlePostV2 = (req: Request, res: Response) => {
        if(req.body && req.body.data){
            const parsedData = this.parseText(req.body.data, false)
            res.send(parsedData)
        } else {
            res.send("Not a valid request body!")
        }
    }
}

export default PostsController