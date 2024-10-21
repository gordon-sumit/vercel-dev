import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {UserModel} from "../../models/user.model";

@Injectable()
export class UserService {
    constructor(@InjectModel(UserModel) private user: typeof UserModel) {
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

    async createUser(userData): Promise<UserModel> {
        return this.user.create(userData)
    }
}
