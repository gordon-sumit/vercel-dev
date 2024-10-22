import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {UserModel} from "../../models/user.model";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class UserService {
    constructor(@InjectModel(UserModel) private user: typeof UserModel, private jwtService: JwtService) {
    }

    async getUser(): Promise<UserModel[]> {
        return this.user.findAll({include: 'schoolUsers'});
    }

    async login(email, pass): Promise<UserModel> {
        return this.user.findOne({where: [{email: email, password: pass}]})
    }

    async getUserById(id): Promise<UserModel> {
        return this.user.findOne({
            where: [{id: id}],
            include: ['schoolUsers', 'userTeams']
        })
    }

    async createUser(userData): Promise<any> {
        const isUserExist = await this.user.findOne({
            where:[{email:userData.email}]
        });
        if(!isUserExist){
            return this.user.create(userData)
        }else{
            const payload = {sub: isUserExist.id, username: isUserExist.email}
            const token = await this.jwtService.signAsync(payload);
            return { access_token: token}
        }
    }
}
